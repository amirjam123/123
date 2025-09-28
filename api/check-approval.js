// Vercel serverless function to check poll approval status
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
    const { pollId } = req.body;

    if (!pollId) {
      return res.status(400).json({ error: 'Poll ID is required' });
    }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

    if (!BOT_TOKEN) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Get updates to check poll results
    const updatesResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`);
    const updatesData = await updatesResponse.json();
    
    let approved = null;
    
    if (updatesData.ok && updatesData.result.length > 0) {
      // Look for poll answers matching our poll ID
      for (const update of updatesData.result.reverse()) {
        if (update.poll_answer && update.poll_answer.poll_id === pollId) {
          // Option 0 = Approve, Option 1 = Reject
          approved = update.poll_answer.option_ids.includes(0);
          break;
        }
      }
    }

    if (approved === null) {
      return res.status(202).json({ 
        status: 'pending',
        message: 'Waiting for approval...'
      });
    }

    res.status(200).json({ approved });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}