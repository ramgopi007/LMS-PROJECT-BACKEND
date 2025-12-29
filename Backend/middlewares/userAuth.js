const jwt = require("jsonwebtoken");
const User = require("../models/signUpSchema");
require("dotenv").config();

const userAuth = async (req, res, next) => {
  try {
    // 1. Extract token (Check cookies first, then Authorization header)
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    // 2. Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ success: false, message: "Invalid or expired token." });
    }

    // 3. Fetch full user to ensure they still exist and are active
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // 4. Attach data to req.user (Crucial for controllers)
    req.user = {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    next();
  } catch (error) {
    console.error("userAuth Error:", error);
    return res.status(500).json({ success: false, message: "Server error in authentication." });
  }
};

module.exports = { userAuth };