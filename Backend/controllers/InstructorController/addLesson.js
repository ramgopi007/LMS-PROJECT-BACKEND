const Course = require("../../models/Course");
const cloudinary = require("../../config/cloudinary");

const addLesson = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Video file is required" });
    }

    // Upload video to Cloudinary
    const uploadedVideo = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: "lms_videos",
    });

    const course = await Course.findOne({
      _id: courseId,
      instructor: req.user._id,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or unauthorized",
      });
    }

    // Add lesson
    course.lessons.push({
      title,
      videoUrl: uploadedVideo.secure_url,
      duration: uploadedVideo.duration || 0,
    });

    await course.save();

    res.status(201).json({
      success: true,
      message: "Lesson added successfully",
      lessons: course.lessons,
    });

  } catch (error) {
    console.error("Error adding lesson:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addLesson };
