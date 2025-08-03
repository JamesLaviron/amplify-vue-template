import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import type { APIGatewayProxyHandler } from 'aws-lambda';

const sesClient = new SESClient({ region: process.env.SES_REGION || 'us-east-1' });

export const handler: APIGatewayProxyHandler = async (event) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'OPTIONS,POST'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Request body is required' })
      };
    }

    const { name, email, subject, message, priority } = JSON.parse(event.body);

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'All fields are required' })
      };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email address' })
      };
    }

    const priorityLabel = priority?.toUpperCase() || 'NORMAL';
    const emailSubject = `Fantasy Football - ${subject}`;
    const emailBody = `
Name: ${name}
Email: ${email}
Priority: ${priorityLabel}
Subject: ${subject}

Message:
${message}

---
Sent from Fantasy Football Help Center
${new Date().toLocaleString()}
    `.trim();

    const params = {
      Source: 'noreply@gerfaud.fr', // This should be a verified email in SES
      Destination: {
        ToAddresses: [process.env.TO_EMAIL || 'victor@gerfaud.fr']
      },
      Message: {
        Subject: {
          Data: emailSubject,
          Charset: 'UTF-8'
        },
        Body: {
          Text: {
            Data: emailBody,
            Charset: 'UTF-8'
          },
          Html: {
            Data: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #D9A299;">Fantasy Football Support Request</h2>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Priority:</strong> <span style="color: ${priority === 'urgent' ? '#dc2626' : priority === 'high' ? '#ea580c' : '#16a34a'};">${priorityLabel}</span></p>
                  <p><strong>Subject:</strong> ${subject}</p>
                </div>
                <div style="background: white; padding: 20px; border-left: 4px solid #D9A299; margin: 20px 0;">
                  <h3>Message:</h3>
                  <p style="white-space: pre-wrap;">${message}</p>
                </div>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
                <p style="color: #666; font-size: 12px;">
                  Sent from Fantasy Football Help Center<br>
                  ${new Date().toLocaleString()}
                </p>
              </div>
            `,
            Charset: 'UTF-8'
          }
        }
      },
      ReplyToAddresses: [email] // Allow replying directly to the user
    };

    const command = new SendEmailCommand(params);
    await sesClient.send(command);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully' 
      })
    };

  } catch (error) {
    console.error('Error sending email:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to send email', 
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};