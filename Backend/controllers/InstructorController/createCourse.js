const Course = require("../../models/Course");

// 🟩 1️⃣ Create a new course
const createCourse = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;

    // Validation
    if (!title || !description || !category) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const course = new Course({
      title,
      description,
      category,
      price,
      instructor: req.user._id, // from instructorAuth middleware
    });

    await course.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully.",
      course,
    });
  } catch (error) {
    console.error("Error creating course:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {createCourse};