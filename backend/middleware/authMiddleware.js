const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("Auth Header received:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Extracted Token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token Data:", decoded);

    const userId = decoded.id || decoded.userId;
    console.log("Looking for user with ID:", userId); 

    const userObjectId = new mongoose.Types.ObjectId(userId); // Convert to ObjectId
    console.log("Converted ObjectId:", userObjectId);

    req.user = await User.findById(userObjectId).select("-password"); // Attach user to request
    console.log("User found in DB:", req.user);

    if (!req.user) return res.status(401).json({ error: "Invalid token" });

    next();
  } catch (err) {
    return res.status(401).json({ error: "Token verification failed" });
  }
};

const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

module.exports = { verifyToken, verifyAdmin };

