// config/multer.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadsDir = path.resolve(process.cwd(), "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ["mp4", "mov", "avi", "mkv", "jpg", "jpeg", "png"];

  const ext = path.extname(file.originalname).substring(1).toLowerCase();

  if (!allowed.includes(ext)) {
    return cb(new Error("Only images or video files allowed!"));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 1000 * 1024 * 1024 }, // 1000MB
  fileFilter,
});

module.exports = upload;
module.exports.uploadsDir = uploadsDir;
