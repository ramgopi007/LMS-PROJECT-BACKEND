const jwt = require("jsonwebtoken");
const User = require("../models/signUpSchema");
require("dotenv").config();

const instructorAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ FIXED HERE
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.role !== "instructor") {
      return res.status(403).json({ message: "Access denied. Instructor only." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Instructor auth error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = { instructorAuth };
