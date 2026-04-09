const mongoose = require('mongoose');
const User = require('./models/user');
const bcrypt = require('bcrypt');
require("dotenv").config();
const { connectDB } = require("./config/database");

const checkPassword = async () => {
    try {
        await connectDB();
        const user = await User.findOne({ email: 'pranavamreliya@gmail.com' });
        if (!user) {
            console.log("User not found");
        } else {
            console.log(`User: ${user.email}`);
            console.log(`Hash in DB: ${user.password}`);
            const isMatch = await bcrypt.compare('12345678', user.password);
            console.log(`Does '12345678' match? ${isMatch}`);
        }
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkPassword();
