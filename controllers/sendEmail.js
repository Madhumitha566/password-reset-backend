import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config(); // Initialize environment variables

const sendEmail = async (email, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Note: Use an App Password for Gmail
      },
      tls:{
          rejectUnauthorized:false
         }
    });
  
    const mailOptions = {
      from: `"Support Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: message,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
    
  } catch (error) {
    console.error("Nodemailer Error:", error.message);
    throw new Error("Email could not be sent");
  }
   
};

export default sendEmail;