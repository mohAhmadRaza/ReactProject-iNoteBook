const mongoose = require('mongoose');

const ConnectToMongo = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/inotebook");
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
    }
}

module.exports = ConnectToMongo;