// controllers/lesson/addLesson.js
const fs = require("fs");
const Lesson = require("../../models/Lesson");
const Course = require("../../models/Course");
const cloudinary = require("../../config/cloudinary");
const uploadsDir = require("../../middlewares/multer"); // Import for cleanup check

const addLesson = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description } = req.body;

    // 1️⃣ Validate video upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a video using field name 'lessonVideo'",
      });
    }

    // 2️⃣ Find course owned by logged-in instructor
    const course = await Course.findOne({
      _id: courseId,
      instructor: req.user._id, // ✅ matches middleware
    });

    if (!course) {
      // ❌ Critical fix: Delete file on course not found error
      fs.unlinkSync(req.file.path); 
      return res.status(404).json({
        success: false,
        message: "Course not found or you are not the instructor.",
      });
    }

    // 3️⃣ Upload video to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: "lessonVideos",
    });

    // 4️⃣ Create lesson document
    const lesson = await Lesson.create({
      course: courseId,
      title,
      description,
      videoUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });

    // 5️⃣ Remove temp local file after successful Cloudinary upload
    fs.unlinkSync(req.file.path);

    return res.status(201).json({
      success: true,
      message: "Lesson added successfully",
      lesson,
    });
  } catch (error) {
    console.error("❌ Add lesson error:", error);

    // ❌ Critical fix: Delete file on any upload/db error
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("❌ Failed to delete local file:", unlinkError);
      }
    }

    return res.status(500).json({
      success: false,
      message: "Error adding lesson",
      error: error.message,
    });
  }
};

module.exports = { addLesson };