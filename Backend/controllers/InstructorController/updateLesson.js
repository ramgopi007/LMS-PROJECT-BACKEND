const Lesson = require("../../models/Lesson");
const Course = require("../../models/Course");
const cloudinary = require("../../config/cloudinary");

const updateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { title, description } = req.body;

    const lesson = await Lesson.findById(lessonId).populate("course");
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // Ensure instructor owns the lesson’s course
    if (lesson.course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // If new video uploaded
    if (req.file) {
      const uploadVideo = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "video",
        folder: "lessonVideos",
      });
      lesson.videoUrl = uploadVideo.secure_url;
    }

    if (title) lesson.title = title;
    if (description) lesson.description = description;

    await lesson.save();

    res.json({
      success: true,
      message: "Lesson updated successfully",
      lesson,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { updateLesson };
