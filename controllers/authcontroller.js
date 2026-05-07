import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import sendEmail from '../controllers/sendEmail.js'; 
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// SIGNUP
export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    const token = generateToken(newUser);
    res.status(201).json({ message: "User created", token, user: { email: newUser.email } });
  } catch (err) {
    res.status(500).json({ message: "Error creating user" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.status(200).json({ message: "Login successful", token, user: { email: user.email } });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 1. Create a raw random token for the URL
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // 2. Hash it before saving to the DB (Security Best Practice)
    user.resetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();
    // 3. Send the UNHASHED token in the link
   
    
    const resetUrl = `https://frontendurl-password-reset.netlify.app/reset-password/${resetToken}`;
    const subject = "Password Reset Request";
    const htmlContent = `
      <div style="font-family: sans-serif; line-height: 1.5;">
        <h1>Password Reset</h1>
        <p>You requested a password reset. Click the button below to proceed:</p>
        <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
        <p>Or copy and paste this link into your browser:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p><strong>This link will expire in 1 hour.</strong></p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `;

    // 4. Trigger the Brevo API via our sendEmail utility
    await sendEmail({
      to: process.env.EMAIL_FROM,
      subject: subject,
      html: htmlContent
    });
    res.status(200).json({ message: "Reset link sent to mail" });
  

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during forgot password" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params; // This is the unhashed token from the URL
    const { password } = req.body;

    // 1. Hash the token from the URL to compare with the DB
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    // 2. Update user
    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: "Password updated successfully" }); 
  } catch (err) {
    res.status(500).json({ message: "Error resetting password" });
  }
};


