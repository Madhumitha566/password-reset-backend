import express from 'express'
import {signup,login,forgotPassword,resetPassword} from "../controllers/authcontroller.js"
import sendLogin from '../controllers/notification.js';
const router = express.Router();

router.post('/signup',signup)
router.post('/login',login)
router.post('/forgot-password',forgotPassword)
router.post('/reset-password/:token',resetPassword)
router.post('/send-login-email',sendLogin)
export default router;