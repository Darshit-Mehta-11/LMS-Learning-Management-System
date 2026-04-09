const mongoose = require('mongoose');
const Course = require('./models/course');
const Section = require('./models/section');
const SubSection = require('./models/subSection');
require("dotenv").config();

const { connectDB } = require("./config/database");

const seedCourseContent = async () => {
    try {
        await connectDB();
        console.log("Connected to DB, seeding course content (Sections & Videos)...");

        // Open-source dummy video (Big Buck Bunny)
        const dummyVideoUrl = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

        // Find all courses that need content
        const courses = await Course.find();

        for (const course of courses) {
            console.log(`Processing course: ${course.courseName}`);

            // Skip if course already has content to avoid duplication
            if (course.courseContent && course.courseContent.length > 0) {
                console.log(`Course ${course.courseName} already has content. Skipping.`);
                continue;
            }

            const updatedSections = [];

            // Create 2 Sections per course
            const sectionNames = ["Introduction & Setup", "Core Concepts & Deep Dive"];

            for (let i = 0; i < sectionNames.length; i++) {
                const subSectionIds = [];

                // Create 2 SubSections (Videos) per Section
                for (let j = 1; j <= 2; j++) {
                    const newSubSection = await SubSection.create({
                        title: `Video ${j}: ${sectionNames[i]} - Part ${j}`,
                        timeDuration: "10:00", // dummy 10 mins
                        description: `This is a mock description for ${sectionNames[i]} Video ${j}. It covers the fundamental aspects.`,
                        videoUrl: dummyVideoUrl
                    });

                    subSectionIds.push(newSubSection._id);
                }

                // Create the Section with the generated SubSections
                const newSection = await Section.create({
                    sectionName: sectionNames[i],
                    subSection: subSectionIds
                });

                updatedSections.push(newSection._id);
            }

            // Update the Course to include the new Sections
            await Course.findByIdAndUpdate(course._id, {
                $set: { courseContent: updatedSections }
            });

            console.log(`Successfully seeded 2 Sections and 4 Videos for: ${course.courseName}`);
        }

        console.log(`\nSuccessfully seeded content for ${courses.length} courses!`);
        process.exit(0);

    } catch (error) {
        console.error("Error during course content seeding:", error);
        process.exit(1);
    }
};

seedCourseContent();
