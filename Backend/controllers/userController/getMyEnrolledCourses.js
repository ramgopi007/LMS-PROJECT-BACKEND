const User = require("../../models/signUpSchema");

const getMyEnrolledCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate({
        path: "enrolledCourses",
        populate: { path: "instructor", select: "firstName lastName profilePicture" }
      });

    const enrolled = user && user.enrolledCourses ? user.enrolledCourses : [];
    return res.json({ success: true, data: enrolled });
  } catch (err) {
    console.error("getMyEnrolledCourses:", err);
    return res.status(500).json({ success: false, message: "Error fetching enrolled courses." });
  }
};

module.exports = {getMyEnrolledCourses};