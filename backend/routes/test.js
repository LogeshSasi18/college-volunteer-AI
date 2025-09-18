require('dotenv').config();
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET; // Replace with process.env.JWT_SECRET

const token = ""; // Your token here

try {
  const decoded = jwt.verify(token, secret);
  console.log("Decoded Token:", decoded);
} catch (err) {
  console.log("Token verification failed:", err.message);
}