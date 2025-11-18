// controllers/lesson/addLesson.js
const fs = require("fs");
const Lesson = require("../../models/Lesson");
const Course = require("../../models/Course");
const cloudinary = require("../../config/cloudinary");

const addLesson = async (req, res) => {
  // ... (try/catch block)
  try {
    const { courseId } = req.params;
    const { title, description, duration, order } = req.body; // Added duration and order

    // 1️⃣ Validate required lesson fields
    if (!title || !description || !duration || !order) {
      // ❌ Critical fix: Delete file on field validation error
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: "Title, description, duration (seconds), and order (number) are required." });
    }

    // 2️⃣ Validate video upload
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload a video using field name 'lessonVideo'." });
    }

    // 3️⃣ Find course owned by logged-in instructor
    const course = await Course.findOne({
      _id: courseId,
      instructor: req.user._id, // ✅ matches middleware
    });

    if (!course) {
      fs.unlinkSync(req.file.path); // Delete file if course not found
      return res.status(404).json({ success: false, message: "Course not found or you are not the instructor." });
    }

    // 4️⃣ Upload video to Cloudinary (use dynamic folder based on course ID)
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: `courseLessons/${courseId}`, // Better organization
    });

    // 5️⃣ Create lesson document
    const lesson = await Lesson.create({
      course: courseId,
      title,
      description,
      duration: Number(duration), // Convert to Number
      order: Number(order),       // Convert to Number
      videoUrl: uploadResult.secure_url,
      // publicId: uploadResult.public_id, // Store public ID for deletion
    });

    // 🌟 New: Add the lesson to the course's lessons array
    course.lessons.push(lesson._id);
    await course.save();

    // 6️⃣ Remove temp local file after successful Cloudinary upload
    fs.unlinkSync(req.file.path);

    return res.status(201).json({
      success: true,
      message: "Lesson added successfully and linked to course.",
      lesson,
    });
  } catch (error) {
    // ... (rest of the error handling remains the same)
    console.error("❌ Add lesson error:", error);
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("❌ Failed to delete local file:", unlinkError);
      }
    }
    return res.status(500).json({ success: false, message: "Error adding lesson", error: error.message });
  }
};

module.exports = { addLesson };