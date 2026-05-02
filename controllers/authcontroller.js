// authController.js
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import sendEmail from '../controllers/sendEmail.js';
import jwt from 'jsonwebtoken';


const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;


    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

   
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

   
    const token = generateToken(newUser);

    res.status(201).json({ 
      message: "User created successfully", 
      token, 
      user: { email: newUser.email } 
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating user" });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;


    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    
    const token = generateToken(user);

    res.status(200).json({ 
      message: "Login successful", 
      token, 
      user: { email: user.email } 
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });


  if (!user) return res.status(404).json({ message: "User not found" });


  const token = crypto.randomBytes(20).toString('hex');
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 3600000; 
  await user.save(); 

  const resetUrl = `https://frontendurl-password-reset.netlify.app/reset-password/${token}`;
  try {
    await sendEmail(email, "Password Reset", `Click here: ${resetUrl}`);
    res.json({ message: "Reset link sent to mail" });
  } catch (err) {
    res.status(500).json({ message: "Email could not be sent" });
  }
};


export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;


  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() }
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired token" });


  user.password = await bcrypt.hash(password, 10);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.json({ message: "Password updated successfully" });
};
