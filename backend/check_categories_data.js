const mongoose = require('mongoose');
const Category = require('./models/category');
const Course = require('./models/course');
require("dotenv").config();
const { connectDB } = require("./config/database");

const checkData = async () => {
    try {
        await connectDB();

        const categories = await Category.find({});
        console.log("Categories in DB:");
        for (const cat of categories) {
            const publishedCoursesCount = await Course.countDocuments({
                category: cat._id,
                status: 'Published'
            });
            const totalCoursesCount = await Course.countDocuments({
                category: cat._id
            });
            console.log(`- ${cat.name} (${cat._id}): ${publishedCoursesCount} Published / ${totalCoursesCount} Total`);

            // If mismatch, let's see some courses from this category
            if (totalCoursesCount > 0) {
                const sampleCourses = await Course.find({ category: cat._id }).limit(3);
                sampleCourses.forEach(c => {
                    console.log(`  * Course: ${c.courseName}, Status: ${c.status}`);
                });
            }
        }

        const orphanCourses = await Course.find({ category: { $exists: false } });
        console.log(`\nOrphan Courses (no category): ${orphanCourses.length}`);

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkData();
