const Course = require("../../models/Course");

// 🟩 Update Course (Only Course Owner Can Update)
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params; // course ID from URL
    const { title, description, category, price } = req.body;

    // 1️⃣ Find course and ensure instructor owns it
    const course = await Course.findOneAndUpdate(
      {
        _id: id,
        instructor: req.user._id, // only course owner can update
      },
      {
        title,
        description,
        category,
        price,
      },
      {
        new: true,        // return updated course
        runValidators: true, // apply schema validations
      }
    );

    // 2️⃣ If course not found or not owned by instructor
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or you are not authorized to update this course.",
      });
    }

    // 3️⃣ Success
    res.status(200).json({
      success: true,
      message: "Course updated successfully.",
      course,
    });

  } catch (error) {
    console.error("Error updating course:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while updating course.",
      error: error.message,
    });
  }
};

module.exports = {updateCourse};
