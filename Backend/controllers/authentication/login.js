const jwt = require("jsonwebtoken");
const User = require("../../models/signUpSchema");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).send({ message: "Email and password are required." });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "Invalid email or password." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: "Invalid email or password." });
    }

    // Generate JWT (include role)
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret_key",
      { expiresIn: "1h" }
    );

    // Store token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set true in production
      sameSite: "Lax",
    });

    res.status(200).send({
      message: "Login successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).send({ message: "Error logging in", error: error.message });
  }
};

module.exports = { login };
