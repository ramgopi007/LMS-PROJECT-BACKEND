const mongoose = require("mongoose");
const validator = require("validator"); // Assuming 'validator' is installed and used

const signUpSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minlength: [2, "First name must be at least 2 characters long"],
      maxlength: [50, "First name cannot exceed 50 characters"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      minlength: [2, "Last name must be at least 2 characters long"],
      maxlength: [50, "Last name cannot exceed 50 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: "Please enter a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      validate: {
        validator: validator.isStrongPassword,
        message:
          "Password must include 1 uppercase, 1 lowercase, 1 number, and 1 special character (min 8 chars)",
      },
      select: false, // Security: Prevents the password from being returned by default in queries
    },
    role: {
      type: String,
      required:[true ,"Role is required"],
      enum: ["user", "instructor", "admin"],
      default: "user",
    },
    profilePicture: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    skills: {
      type: [String],
      default: [],
    },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course", // IMPORTANT: Must match the name of your Course Model
      },
    ],

   /*  Field to hold courses the user has created (as an instructor) */
    
    createdCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course", // IMPORTANT: Must match the name of your Course Model
      },
    ],

    // *** Timestamps and Statuses ***
    createdAt: {
      type: Date,
      default: Date.now,
    },
    active: {
      type: Boolean,
      default: true,
      select: false, // Used for soft deletion/account deactivation
    },
  },
  {
    timestamps: true, // Adds 'createdAt' and 'updatedAt' fields automatically
  }
);


module.exports = mongoose.model("User", signUpSchema);
