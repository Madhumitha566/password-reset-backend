import nodemailer from 'nodemailer';

const sendEmail = async (email, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
     port: 465,
     secure: true, // Use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
      },
    });

    // 2. Define the email options
    const mailOptions = {
      from: `"Support Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: message,
    };

    // 3. Send the email
    const info = await transporter.sendMail(mailOptions);
    
    console.log("Email sent successfully: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error occurred while sending email:", error.message);
    throw new Error("Email could not be sent");
  }
};

export default sendEmail;