const mongoose = require('mongoose');
const Category = require('./models/category');
const Course = require('./models/course');
require("dotenv").config();
const { connectDB } = require("./config/database");

const checkIds = async () => {
    try {
        await connectDB();
        const categories = await Category.find({});
        for (const cat of categories) {
            console.log(`\nCategory: ${cat.name}`);
            for (const courseId of cat.courses) {
                const course = await Course.findById(courseId);
                if (course) {
                    console.log(`- Course ID ${courseId}: FOUND (${course.courseName}), Status: ${course.status}`);
                } else {
                    console.log(`- Course ID ${courseId}: NOT FOUND in Courses collection!`);
                }
            }
        }
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkIds();
