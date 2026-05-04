import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config(); // Initialize environment variables

const sendEmail = async (email, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Note: Use an App Password for Gmail
      },
      family: 4,
      tls:{
          rejectUnauthorized:false
         }
    });
      try {
     await transporter.verify();
     console.log("Server is ready to take our messages");
     } catch (err) {
  console.error("Verification failed:", err);
      }
  
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
