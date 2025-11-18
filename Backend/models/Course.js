const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters long"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      minlength: [10, "Description must be at least 10 characters long"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    thumbnail: {
      type: String, // URL to the course image
      required: true,
    },
    // The instructor field is good. It links to the 'User' model.
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Matches the name of your User model
      required: true,
    },
    // *** Added Relationship Fields ***
    lessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson", // Matches the name of your Lesson model
      },
    ],
    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Matches the name of your User model
      },
    ],
    ratingAndReviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review", // You'll need to create a Review schema
      },
    ],
    // *** LMS Status Fields ***
    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Draft",
    },
    // You can add fields for averageRating/totalReviews later via virtuals or pre-save hooks
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

module.exports = mongoose.model("Course", courseSchema);