/* import { BrevoClient, BrevoError } from '@getbrevo/brevo';
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

export default sendEmail; */


// Include the Brevo library
/* import SibApiV3Sdk from 'sib-api-v3-sdk';

// Initialize and configure the Brevo Client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY; 

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();


 const sendEmail = (userLoginEmail) => {
  var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = "My subject";
  sendSmtpEmail.htmlContent = "<html><body><h1>Congratulations!</h1><p>You successfully sent this transactional email via the Brevo API.</p></body></html>";

  sendSmtpEmail.sender = { 
    "name": "From Name", 
    "email": process.env.EMAIL_FROM 
  };

  sendSmtpEmail.to = [{ 
    "email": userLoginEmail, 
  }];

  // Make the call to the Brevo API and return the promise
  return apiInstance.sendTransacEmail(sendSmtpEmail)
    .then(function(data) {
      console.log('API called successfully. Returned data: ' + JSON.stringify(data));
      return data;
    })
    .catch(function(error) {
      console.error('Error sending email:', error);
      throw error; 
    });
};
export default sendEmail */
import SibApiV3Sdk from 'sib-api-v3-sdk';

// Initialize and configure the Brevo Client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY; 

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();


const sendEmail = ({ to, subject, html }) => {
  var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = html;

  sendSmtpEmail.sender = { 
    "name": "My App", 
    "email": process.env.EMAIL_FROM 
  };

  sendSmtpEmail.to = [{ 
    "email": to 
  }];

  // Make the call to the Brevo API and return the promise
  return apiInstance.sendTransacEmail(sendSmtpEmail)
    .then(function(data) {
      console.log('API called successfully. Returned data: ' + JSON.stringify(data));
      return data;
    })
    .catch(function(error) {
      console.error('Error sending email:', error);
      throw error; 
    });
};
export default sendEmail