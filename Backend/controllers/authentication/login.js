const jwt = require("jsonwebtoken");
const User = require("../../models/signUpSchema");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).send({ message: "Email and password are required." });
    }

    // Check user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).send({ message: "Invalid email or password." });
    }

    // Check password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: "Invalid email or password." });
    }

    // Create JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret_key",
      { expiresIn: "1h" }
    );

    // Set cookie (working for localhost)
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      path: "/",
      maxAge: 60 * 60 * 1000,
    });

    // Response
    res.status(200).send({
      success: true,
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
