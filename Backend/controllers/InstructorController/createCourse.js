const Course = require("../../models/Course");
const User = require("../../models/signUpSchema"); // Need User model for linking createdCourses

const createCourse = async (req, res) => {
  try {
    const { title, description, category, price, thumbnail } = req.body; // Added thumbnail

    // Validation
    if (!title || !description || !category || !thumbnail) { // Added thumbnail to check
      return res.status(400).json({ message: "Required fields are missing: title, description, category, and thumbnail are required." });
    }
    
    // Ensure price is a number and non-negative
    const coursePrice = Number(price) || 0;

    const course = new Course({
      title,
      description,
      category,
      price: coursePrice,
      thumbnail, // New field
      instructor: req.user._id, // from instructorAuth middleware
      status: "Draft", // Default status upon creation
    });

    await course.save();

    // 🌟 New: Link the course back to the instructor's createdCourses array
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { createdCourses: course._id } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Course created successfully (Status: Draft).",
      course,
    });
  } catch (error) {
    console.error("Error creating course:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createCourse };