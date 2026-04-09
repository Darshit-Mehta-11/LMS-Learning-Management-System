const mongoose = require('mongoose');
const User = require('./models/user');
const Course = require('./models/course');
require("dotenv").config();
const { connectDB } = require("./config/database");

const checkUserEnrollment = async () => {
    try {
        await connectDB();
        const email = 'darshitmehta1311@gmail.com';
        const user = await User.findOne({ email }).populate('courses');

        if (!user) {
            console.log("User not found");
            process.exit(1);
        }

        console.log(`User: ${user.firstName} ${user.lastName}`);
        console.log(`Account Type: ${user.accountType}`);
        console.log(`Enrolled Courses Count: ${user.courses.length}`);

        user.courses.forEach(course => {
            console.log(`- Course: ${course.courseName} (${course._id})`);
        });

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkUserEnrollment();
