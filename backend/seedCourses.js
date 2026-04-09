const mongoose = require('mongoose');
const Category = require('./models/category');
const Course = require('./models/course');
const User = require('./models/user');
const Profile = require('./models/profile');
const bcrypt = require('bcrypt');
require("dotenv").config();

const { connectDB } = require("./config/database");

const seedCourses = async () => {
    try {
        await connectDB();
        console.log("Connected to DB, checking for Dummy Instructor...");

        // 1. Create or Find an Instructor
        let instructor = await User.findOne({ email: "dummy.instructor@learnhub.com" });

        if (!instructor) {
            console.log("Instructor not found. Creating a dummy instructor...");

            // Create a dummy Profile first
            const profileDetails = await Profile.create({
                gender: "Male",
                dateOfBirth: "",
                about: "I am a dummy instructor created for testing purposes.",
                contactNumber: "1234567890",
            });

            // Hash a simple password
            const hashedPassword = await bcrypt.hash("password123", 10);

            // Create the instructor
            instructor = await User.create({
                firstName: "Dummy",
                lastName: "Instructor",
                email: "dummy.instructor@learnhub.com",
                password: hashedPassword,
                accountType: "Instructor",
                active: true,
                approved: true,
                additionalDetails: profileDetails._id,
                image: "https://api.dicebear.com/5.x/initials/svg?seed=Dummy%20Instructor",
            });
            console.log("Dummy instructor created successfully.");
        } else {
            console.log("Dummy instructor already exists.");
        }

        // 2. Fetch all Categories
        const categories = await Category.find();

        if (categories.length === 0) {
            console.log("No categories found! Please run the categories seeder first.");
            process.exit(1);
        }

        // 3. Create dummy courses for EVERY category
        console.log("Generating mock courses for all categories...");

        let createdCourses = [];

        for (const category of categories) {
            const mockCourses = [
                {
                    courseName: `Introduction to ${category.name}`,
                    courseDescription: `A comprehensive beginner's guide to ${category.name}. Master the fundamentals.`,
                    instructor: instructor._id,
                    whatYouWillLearn: `Fundamentals of ${category.name}, best practices, and practical examples.`,
                    price: 999,
                    thumbnail: "https://res.cloudinary.com/dwyztd0r1/image/upload/v1691307524/studyNotion/courses/Web_Development_pfuikp.png", // Generic thumbnail
                    category: category._id,
                    tag: ["Beginner", category.name],
                    status: "Published",
                    studentsEnrolled: [],
                    instructions: ["Have a laptop", "Basic internet knowledge"],
                    createdAt: Date.now(),
                },
                {
                    courseName: `Advanced ${category.name} Masterclass`,
                    courseDescription: `Take your skills in ${category.name} to the next level with this advanced masterclass.`,
                    instructor: instructor._id,
                    whatYouWillLearn: `Advanced patterns, performance optimization, and real-world projects in ${category.name}.`,
                    price: 1999,
                    thumbnail: "https://res.cloudinary.com/dwyztd0r1/image/upload/v1691307524/studyNotion/courses/Web_Development_pfuikp.png",
                    category: category._id,
                    tag: ["Advanced", category.name, "Masterclass"],
                    status: "Published",
                    studentsEnrolled: [],
                    instructions: ["Completed Beginner course", "High-speed internet"],
                    createdAt: Date.now(),
                }
            ];

            // Insert courses
            const insertedCourses = await Course.insertMany(mockCourses);
            createdCourses = [...createdCourses, ...insertedCourses];

            // 4. Update Category with new course IDs
            const courseIds = insertedCourses.map(course => course._id);
            await Category.findByIdAndUpdate(category._id, {
                $push: { courses: { $each: courseIds } }
            });
            console.log(`Added 2 courses to category: ${category.name}`);
        }

        // 5. Update Instructor with all created course IDs
        const allCourseIds = createdCourses.map(course => course._id);
        await User.findByIdAndUpdate(instructor._id, {
            $push: { courses: { $each: allCourseIds } }
        });

        console.log(`\nSuccessfully seeded ${createdCourses.length} dummy courses across all categories!`);
        process.exit(0);

    } catch (error) {
        console.error("Error during course seeding:", error);
        process.exit(1);
    }
};

seedCourses();
