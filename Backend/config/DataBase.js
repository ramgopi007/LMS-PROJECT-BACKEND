const mongoose = require('mongoose');
const mongoURI = process.env.MONGO_URI;

const DbConnection = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('📦 Database connected successfully');
    } catch (error) {
        console.log('Error : Will Db Connection ', error);
    }
}

module.exports = DbConnection;