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