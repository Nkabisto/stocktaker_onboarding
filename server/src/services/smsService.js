// server/src/utils/smsService.js
import 'dotenv/config';

export async function sendSMS(to, message) {
  // Credentials from .env
  const TOKEN_ID = process.env.BULKSMS_TOKEN_ID;
  const TOKEN_SECRET = process.env.BULKSMS_TOKEN_SECRET;

  // Base64 encode credentials for Basic Auth
  const auth = Buffer.from(`${TOKEN_ID}:${TOKEN_SECRET}`).toString('base64');

  const payload = {
    to: to,      // e.g., "+27001234567"
    body: message
  };

  try {
    const response = await fetch('https://api.bulksms.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`BulkSMS Error: ${data.status || response.statusText}`);
    }

    console.log('✅ SMS Sent Successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ SMS Failed:', error.message);
    return { success: false, error: error.message };
  }
}

