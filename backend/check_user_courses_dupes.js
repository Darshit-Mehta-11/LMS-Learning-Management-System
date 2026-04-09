const mongoose = require('mongoose');
const User = require('./models/user');
require("dotenv").config();
const { connectDB } = require("./config/database");

const checkUserCourses = async () => {
    try {
        await connectDB();
        const user = await User.findOne({ email: 'pranavamreliya@gmail.com' });
        if (!user) {
            console.log("User not found");
        } else {
            console.log(`User: ${user.email}`);
            console.log(`Courses Array Length: ${user.courses.length}`);
            console.log(`Course IDs: ${user.courses}`);
            const uniqueCourses = [...new Set(user.courses.map(id => id.toString()))];
            console.log(`Unique Course IDs: ${uniqueCourses.length}`);
            if (user.courses.length !== uniqueCourses.length) {
                console.log("DUPLICATES FOUND IN USER.COURSES ARRAY!");
            }
        }
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkUserCourses();
