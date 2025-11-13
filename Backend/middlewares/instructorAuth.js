const jwt = require("jsonwebtoken");
const User = require("../models/signUpSchema"); // import your User model

const instructorAuth = async (req, res, next) => {
  try {
    // 1️⃣ Get token (from cookie or header)
    const token = req.cookies.token ;

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Find user in database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 4️⃣ Check role
    if (user.role !== "instructor") {
      return res
        .status(403)
        .json({ message: "Access denied. Instructor only." });
    }

    // 5️⃣ Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Instructor auth error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = {instructorAuth};
