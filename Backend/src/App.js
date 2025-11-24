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

app.use(cors())


app.use('/lms/auth', authRoutes );

app.use('/lms/instructor',instructorRoutes);

app.use('/lms/user',userRoutes);

// Connect to DB first, then start server
Db()
  .then(() => {
    const PORT = process.env.PORT
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error.message);
  });