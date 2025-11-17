const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Course title is required"],
    trim: true,
    minlength: [5, "Title must be at least 5 characters long"]
  },
  description: {
    type: String,
    required: [true, "Course description is required"],
    minlength: [10, "Description must be at least 10 characters long"]
  },
  category: {
    type: String,
    required: [true, "Category is required"],
  },
  price: {
    type: Number,
    default: 0,
    min: [0, "Price cannot be negative"]
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Course", courseSchema);


