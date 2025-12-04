const User = require("../../models/signUpSchema");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role ,bio , skills} = req.body;

    // Validate fields
    if (!firstName || !lastName || !email || !password || !bio || !skills) {
      return res.status(400).send({ message: "All fields are required." });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).send({ message: "Please provide a valid email." });
    }

    if (!validator.isStrongPassword(password)) {   
      return res.status(400).send({
        message:
          "Password must be strong (min 8 chars, uppercase, lowercase, number, symbol).",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "Email is already registered." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || "Student", // Default to 'user' if not provided
      bio:bio,
      skills:skills
    });

    await newUser.save();

    res.status(201).send({
      message: "User registered successfully.",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).send({ message: "Error creating user", error: error.message });
  }
};

module.exports = { signup };
