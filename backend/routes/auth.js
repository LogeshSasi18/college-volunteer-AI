const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const { forgotPassword, resetPassword } = require("../controllers/authController");


// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    console.log("🚀 Received Signup Request:", req.body);

    if (!name || !email || !password || !role) {
      return res.status(400).json({ msg: "Please enter all fields including role" });
    }

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ msg: "Invalid role. Choose 'user' or 'admin'." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    console.log("Saving user to database...");
    await newUser.save();
    console.log("User saved successfully!");

    console.log("Generating JWT token...");
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,  // 🔥 Make sure JWT_SECRET is set in .env
      { expiresIn: "1h" }
    );
    console.log("Token generated successfully!");

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });

  } catch (err) {
    res.status(500).json({ error: 'Server error during signup' });
  }
});


// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔍 Login Request Received:", req.body);

    if (!email || !password) {
      return res.status(400).json({ msg: "Please enter both email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    console.log("✅ User found:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    console.log("✅ Password Matched. Generating JWT...");

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log("📤 Sending Response...");

    res.status(200).json({
      token,
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: 'Server error during login' });
  }
});


// Forgot Password Route
// router.post('/forgot-password', async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ msg: 'User not found' });

//     const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

//     // Ensure email credentials are set in environment variables
//     if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
//       return res.status(500).json({ msg: 'Email service is not configured' });
//     }

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: { 
//         user: process.env.EMAIL_USER, 
//         pass: process.env.EMAIL_PASS 
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Password Reset',
//       text: `Click the link to reset your password: http://localhost:3000/reset-password/${resetToken}`,
//     };

//     await transporter.sendMail(mailOptions);
//     res.json({ msg: 'Reset email sent' });
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error', error: err.message });
//   }
// });


// router.get("/test-user/:id", async (req, res) => {
//   try {
//     const userObjectId = new mongoose.Types.ObjectId(req.params.id); 
//     const user = await User.findById(userObjectId);
    
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);



module.exports = router;
