import SibApiV3Sdk from 'sib-api-v3-sdk';
import dotenv from 'dotenv';

dotenv.config();

const sendEmail = async (email, subject, htmlContent) => {
  try {
    const defaultClient = SibApiV3Sdk.ApiClient.instance;

    // Configure API Key
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    // Use the Transactional Emails API (not Campaign API) for password resets
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    // Define the email settings
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { 
      name: "Support Team", 
      email: process.env.EMAIL_USER 
    };
    sendSmtpEmail.to = [{ email: email }];

    // Make the call
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    console.log("Brevo API called successfully. Message ID:", data.messageId);
    return data;
  } catch (error) {
    // Detailed error logging to catch "Invalid API Key" or "Unauthorized"
    console.error("Brevo Error Status:", error.status);
    console.error("Brevo Error Body:", error.response?.text || error.message);
    throw new Error("Email could not be sent via Brevo");
  }
};

export default sendEmail;