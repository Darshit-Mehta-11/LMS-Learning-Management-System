const mongoose = require('mongoose');
const Category = require('./models/category');
require("dotenv").config();

const { connectDB } = require("./config/database");

const seedCategories = async () => {
    try {
        await connectDB();

        console.log("Connected to DB, checking for existing categories...");

        const existingCategories = await Category.find();
        if (existingCategories.length > 0) {
            console.log("Categories already exist, aborting seeding!");
            process.exit(0);
        }

        const defaultCategories = [
            {
                name: "Web Development",
                description: "Learn to build web applications using modern technologies like React, Node.js, HTML, CSS, etc."
            },
            {
                name: "Python",
                description: "Discover Python, a versatile programming language used in web development, data science, and AI."
            },
            {
                name: "Data Science",
                description: "Dive into data analysis, machine learning, and statistical modeling."
            },
            {
                name: "Cloud Computing",
                description: "Understand the concepts of cloud platforms like AWS, Azure, and Google Cloud."
            },
            {
                name: "Mobile Development",
                description: "Build applications for Android and iOS using Flutter, React Native, or Swift."
            },
            {
                name: "Cyber Security",
                description: "Learn how to protect networks, devices, and data from attacks or unauthorized access."
            }
        ];

        console.log("Seeding categories into the database...");
        await Category.insertMany(defaultCategories);

        console.log("Successfully seeded default categories into the LearnHub LMS DB!");
        process.exit(0);
    } catch (error) {
        console.error("Error during database seeding:", error);
        process.exit(1);
    }
};

seedCategories();
