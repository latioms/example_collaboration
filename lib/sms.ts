// lib/SMS.ts
const SMS_USER_ID = process.env.SMS_USER_ID;
const SMS_PASSWORD = process.env.SMS_PASSWORD;

export const sendSMS = async (phone: string, message: string) => {
    const response = await fetch('https://mboadeals.net/api/v1/sms/sendsms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: SMS_USER_ID,
        password: SMS_PASSWORD ,
        message: message,
        phone_str: phone,
        sender_name: 'HUBLOTS',
      }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to send SMS');
    }
  
    return response.json();
  };
  