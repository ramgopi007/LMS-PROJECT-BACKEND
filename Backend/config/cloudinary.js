// config/cloudinary.js
const cloudinary = require("cloudinary").v2;
require("dotenv").config(); // Ensure dotenv is loaded here if not loaded in your main server file

// Note: Cloudinary expects CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
// Since your .env uses different names, we pass them directly.
cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.CLOUD_API, // This is usually CLOUDINARY_API_KEY
  api_secret:process.env.CLOUD_SECRET, // This is usually CLOUDINARY_API_SECRET
});

module.exports = cloudinary;