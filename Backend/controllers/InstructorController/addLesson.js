const fs = require("fs");
const Lesson = require("../../models/Lesson");
const Course = require("../../models/Course");
const cloudinary = require("../../config/cloudinary");

const addLesson = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, duration, order } = req.body;

    // 1. Validation
    if (!title || !description || !duration || !order) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: "Title, description, duration, and order are required." });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload a video file." });
    }

    const course = await Course.findOne({ _id: courseId, instructor: req.user._id });
    if (!course) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: "Course not found or unauthorized." });
    }

    // 2. 🔥 Promise Wrapper for Cloudinary (The Fix for the 'Chunkable' error)
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_large(
          req.file.path,
          {
            resource_type: "video",
            folder: `courseLessons/${courseId}`,
            chunk_size: 6000000, // 6MB Chunks
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
      });
    };

    console.log("🚀 Starting Cloudinary Upload...");
    const uploadResult = await uploadToCloudinary();

    // 3. Create Lesson
    const lesson = await Lesson.create({
      course: courseId,
      title,
      description,
      duration: Number(duration),
      order: Number(order),
      videoUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });

    course.lessons.push(lesson._id);
    await course.save();

    // 4. Cleanup
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    return res.status(201).json({
      success: true,
      message: "Lesson added successfully!",
      lesson,
    });

  } catch (error) {
    console.error("❌ Add lesson error:", error);
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    return res.status(500).json({ 
      success: false, 
      message: error.message.includes("large") ? "File too large for Cloudinary Free Tier (Max 100MB)" : "Error adding lesson" 
    });
  }
};

module.exports = { addLesson };