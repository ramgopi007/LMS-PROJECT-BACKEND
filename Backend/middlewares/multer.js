const multer = require("multer");
const path = require("path");

// Allowed file types for image & video
const FILE_TYPES = {
  image: ["jpg", "jpeg", "png", "webp"],
  video: ["mp4", "mov", "avi", "mkv"],
};

// Storage (temporary local folder before uploading to Cloudinary)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // temp folder
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// File Filter (dynamic based on usage)
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().replace(".", "");

  const isImage = FILE_TYPES.image.includes(ext);
  const isVideo = FILE_TYPES.video.includes(ext);

  if (isImage || isVideo) {
    cb(null, true);
  } else {
    cb(new Error("Only image or video files are allowed!"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit
  fileFilter,
});

module.exports = upload;
