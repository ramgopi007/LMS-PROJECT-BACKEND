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
  // 1. Expanded allowed list to include images (for thumbnails) and videos (for lessons)
  const allowedExtensions = [".mp4", ".mov", ".avi", ".mkv", ".webm", ".jpg", ".jpeg", ".png", ".webp"];
  
  const ext = path.extname(file.originalname).toLowerCase();

  // 2. Check if the extension is in our allowed list
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    // 3. If it fails, we send a clear error
    cb(new Error(`File type ${ext} is not supported. Please upload a valid Video or Image.`), false);
  }
};

const upload = multer({
  storage,
  limits: { 
    // Keeping it at 100MB for Cloudinary Free Tier safety
    fileSize: 100 * 1024 * 1024 
  },
  fileFilter,
});

module.exports = upload;
module.exports.uploadsDir = uploadsDir;