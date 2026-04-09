const mongoose = require('mongoose');
const Category = require('./models/category');
require("dotenv").config();
const { connectDB } = require("./config/database");

const checkCategoryArrays = async () => {
    try {
        await connectDB();

        const categories = await Category.find({});
        console.log("Categories and their 'courses' array length:");
        for (const cat of categories) {
            console.log(`- ${cat.name} (${cat._id}): ${cat.courses.length} entries in array`);
            if (cat.courses.length > 0) {
                console.log(`  IDs: ${cat.courses.join(", ")}`);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkCategoryArrays();
