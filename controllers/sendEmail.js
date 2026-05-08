/* import { BrevoClient, BrevoError } from '@getbrevo/brevo';
import dotenv from 'dotenv'
dotenv.config()
const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY, 
});


const BREVO_LOGIN_EMAIL = process.env.EMAIL_FROM;


const sendEmail=async ({ to, subject, content })=> {
  try {
    const result = await brevo.transactionalEmails.sendTransacEmail({
      subject: subject,
      textContent: content,
      sender: { name: "My App", email: BREVO_LOGIN_EMAIL },
      to: [{ email: to }]
    });

    return { success: true, messageId: result.messageId };

  } catch (err) {
    if (err instanceof BrevoError) {
      console.error(`Brevo Error [${err.statusCode}]: ${err.message}`);
    } else {
      console.error('Unexpected Error:', err);
    }
    
    return { success: false, error: err.message };
  }
}
export default sendEmail */
import { BrevoClient, BrevoError } from '@getbrevo/brevo';
import dotenv from 'dotenv';

dotenv.config();

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

const BREVO_LOGIN_EMAIL = process.env.EMAIL_FROM;

const sendEmail = async ({ to, subject, html }) => {
  try {
    const result = await brevo.transactionalEmails.sendTransacEmail({
      subject: subject,

      // Use htmlContent for Brevo
      htmlContent: html,

      sender: {
        name: "My App",
        email: BREVO_LOGIN_EMAIL
      },

      to: [{ email: to }]
    });

    return {
      success: true,
      messageId: result.messageId
    };

  } catch (err) {
    if (err instanceof BrevoError) {
      console.error(
        `Brevo Error [${err.statusCode}]: ${err.message}`
      );
    } else {
      console.error('Unexpected Error:', err);
    }

    return {
      success: false,
      error: err.message
    };
  }
};

export default sendEmail;
