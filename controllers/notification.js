import express from 'express';
// Import the Brevo sendEmail function you created earlier
import sendEmail from '../controllers/sendEmail.js';

const router = express.Router();

const sendLogin= async (req, res) => {
  // Destructure the properties exactly as they are sent from your frontend Axios call
  const { to, subject, html } = req.body;

  // Validation: Ensure all necessary data arrived from frontend
  if (!to || !subject || !html) {
    return res.status(400).json({ 
      success: false, 
      message: "Required payload properties (to, subject, or html) are missing." 
    });
  }

  try {
    // Pass the payload directly to your Brevo wrapper function
    const result = await sendEmail({ to, subject, html });
    
    // Send a success response back to the frontend Axios call
    return res.status(200).json({ 
      success: true, 
      message: "Email dispatched to Brevo successfully!", 
      messageId: result.messageId // This matches the ID you saw in your logs
    });
    
  } catch (error) {
    console.error('Brevo API Error in router:', error);
    
    return res.status(500).json({ 
      success: false, 
      message: "Brevo rejected the email dispatch.", 
      error: error.message 
    });
  }
}

export default sendLogin