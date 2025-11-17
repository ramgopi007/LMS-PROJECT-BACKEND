const jwt = require("jsonwebtoken");
const User = require("../models/signUpSchema");
require("dotenv").config();

const userAuth = async (req, res, next) => {
  try {
    // 1️⃣ Get token from cookie or Authorization header (Bearer token)
    const token =
      (req.cookies && req.cookies.token) ||
      (req.header("Authorization")
        ? req.header("Authorization").replace("Bearer ", "")
        : null);

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Access denied. No token provided." });
    }

    // 2️⃣ Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token." });
    }

    // decoded must contain userId
    if (!decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Token does not contain required user information.",
      });
    }

    // 3️⃣ Fetch user from DB (exclude password)
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // 4️⃣ Attach minimal safe user data on req.user
    req.user = {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    next(); // allow request to continue

  } catch (error) {
    console.error("userAuth Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error in authentication.",
    });
  }
};

module.exports = {userAuth};
