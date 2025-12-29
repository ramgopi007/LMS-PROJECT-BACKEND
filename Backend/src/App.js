const path = require("path"); // Added for static files
const cors = require("cors");
require('dotenv').config();
const express = require('express');
const Db = require('../config/DataBase');
const app = express();
app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const authRoutes = require('../Routes/authRoutes');
const instructorRoutes = require('../Routes/instructorRoutes');
const userRoutes = require('../Routes/userRoutes');

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// 🔥 1. INCREASE PAYLOAD LIMITS (Set to 1.1GB to be safe)
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Serve static files - Pointing to the root 'uploads' folder
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


app.use('/lms/auth', authRoutes);

app.use('/lms/instructor', instructorRoutes);

app.use('/lms/student', userRoutes);

// Connect to DB first, then start server
Db()
  .then(() => {
    const PORT = process.env.PORT
    const server = app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
    // 🔥 2. INCREASE SERVER TIMEOUT (10 Minutes)
    // This prevents the server from closing the connection during long uploads
    server.timeout = 300000;
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error.message);
  });