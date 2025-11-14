const Lesson = require("../../models/Lesson");
const Course = require("../../models/Course");
const cloudinary = require("../../config/cloudinary");

const addLesson = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { courseId } = req.params;

    // Check if course exists and belongs to instructor
    const course = await Course.findOne({
      _id: courseId,
      instructor: req.user._id,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or unauthorized.",
      });
    }

    // Upload video to Cloudinary
    const uploadedVideo = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: "lessonVideos",
    });

    // Create lesson
    const lesson = await Lesson.create({
      course: courseId,
      title,
      description,
      videoUrl: uploadedVideo.secure_url,
    });

    res.status(201).json({
      success: true,
      message: "Lesson added successfully.",
      lesson,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding lesson",
      error: error.message,
    });
  }
};

module.exports = { addLesson };
