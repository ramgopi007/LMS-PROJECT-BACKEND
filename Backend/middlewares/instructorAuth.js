const jwt = require("jsonwebtoken");
const User = require("../models/signUpSchema");
require("dotenv").config();

const instructorAuth = async (req, res, next) => {
  try {
    // 1️⃣ Get token (cookie or Authorization header)
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded should contain:  { userId: user._id }
    if (!decoded.userId) {
      return res.status(400).json({ message: "Invalid token payload." });
    }

    // 3️⃣ Find user in DB
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 4️⃣ Check role
    if (user.role !== "instructor") {
      return res.status(403).json({ message: "Access denied. Instructor only." });
    }

    // 5️⃣ Attach user to req
    req.user = user;

    next();
  } catch (error) {
    console.error("Instructor auth error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = { instructorAuth };
