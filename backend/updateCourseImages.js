const mongoose = require('mongoose');
const Course = require('./models/course');
const Category = require('./models/category');
require("dotenv").config();

const { connectDB } = require("./config/database");

const updateCourseImages = async () => {
    try {
        await connectDB();
        console.log("Connected to DB, updating course thumbnails with unique photos...");

        // Map categories to real working Unsplash image URLs (Arrays for uniqueness)
        const categoryImages = {
            "Web Development": [
                "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=800"
            ],
            "Python": [
                "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800"
            ],
            "Data Science": [
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"
            ],
            "Cloud Computing": [
                "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1614064641936-a592664b4074?auto=format&fit=crop&q=80&w=800"
            ],
            "Mobile Development": [
                "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&q=80&w=800"
            ],
            "Cyber Security": [
                "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&q=80&w=800"
            ]
        };

        const defaultImages = [
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1481481600465-36f1f452148b?auto=format&fit=crop&q=80&w=800"
        ];

        // Ensure we assign unique photos for each course
        const usedPhotoIndexes = {};

        // Fetch all categories to match IDs with names
        const categories = await Category.find();
        const categoryMap = {}; // ID -> Name

        categories.forEach(cat => {
            categoryMap[cat._id.toString()] = cat.name;
            usedPhotoIndexes[cat.name] = 0; // Initialize index counter
        });
        usedPhotoIndexes["default"] = 0;

        // Find all courses
        const courses = await Course.find();

        for (const course of courses) {
            const categoryName = categoryMap[course.category.toString()];

            let newImage;
            if (categoryImages[categoryName]) {
                const photosArray = categoryImages[categoryName];
                const index = usedPhotoIndexes[categoryName] % photosArray.length;
                newImage = photosArray[index];
                usedPhotoIndexes[categoryName]++; // Increment for the next course in this category
            } else {
                const index = usedPhotoIndexes["default"] % defaultImages.length;
                newImage = defaultImages[index];
                usedPhotoIndexes["default"]++;
            }

            await Course.findByIdAndUpdate(course._id, { thumbnail: newImage });
            console.log(`Updated unique photo for course: ${course.courseName}`);
        }

        console.log(`\nSuccessfully updated unique thumbnails for ${courses.length} courses!`);
        process.exit(0);

    } catch (error) {
        console.error("Error during image update:", error);
        process.exit(1);
    }
};

updateCourseImages();
