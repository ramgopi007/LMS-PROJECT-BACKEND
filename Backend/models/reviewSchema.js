const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    // 1. Who wrote the review
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User", // Assuming your User model is named "User" or "signUpSchema" (match the name you use)
    },
    
    // 2. What the rating is
    rating: {
        type: Number,
        required: true,
        min: 1, // Minimum rating is 1
        max: 5, // Maximum rating is 5
    },
    
    // 3. The content of the review
    reviewText: {
        type: String,
        trim: true,
    },
    
    // 4. What course the review is for
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Course", // Matches the Course model
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// IMPORTANT: Register the model with Mongoose
// The name "Review" must match the 'ref' used in your Course schema
module.exports = mongoose.model("Review", reviewSchema);