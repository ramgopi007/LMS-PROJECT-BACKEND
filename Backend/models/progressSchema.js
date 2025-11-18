const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    completedLessons: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lesson',
        },
    ],
    completionPercentage: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

module.exports = mongoose.model("CourseProgress", progressSchema);