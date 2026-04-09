const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const { connectDB } = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");
const path = require("path");
require("dotenv").config();

const app = express();

// routes
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const paymentRoutes = require("./routes/payments");
const courseRoutes = require("./routes/course");
const categoryRoutes = require("./routes/categoryRoutes");

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "temp",
  })
);

// routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/categories", categoryRoutes);

// serve static images
app.use("/images", express.static(path.join(__dirname, "public/images")));

// default route
app.get("/", (req, res) => {
  res.send("<div>Server is running fine 🚀</div>");
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Started on PORT ${PORT}`);
});

// connect DB + cloudinary
connectDB();
cloudinaryConnect();


// ================= Main but commented code =================
// const express = require('express')
// const app = express();

// // packages
// const fileUpload = require('express-fileupload');
// const cookieParser = require('cookie-parser');
// const cors = require('cors');
// require('dotenv').config();

// // connection to DB and cloudinary
// const { connectDB } = require('./config/database');
// const { cloudinaryConnect } = require('./config/cloudinary');

// // routes
// const userRoutes = require('./routes/user');
// const profileRoutes = require('./routes/profile');
// const paymentRoutes = require('./routes/payments');
// const courseRoutes = require('./routes/course');
// const categoryRoutes = require("./routes/categoryRoutes");


// // middleware
// app.use(express.json()); // to parse json body
// app.use(cookieParser());
// app.use(
//     cors({
//         // origin: 'http://localhost:5173', // frontend link
//         origin: "*",
//         credentials: true
//     })
// );
// app.use(
//     fileUpload({
//         useTempFiles: true,
//         tempFileDir: '/tmp'
//     })
// )


// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//     console.log(`Server Started on PORT ${PORT}`);
// });

// // connections
// connectDB();
// cloudinaryConnect();

// // mount route
// app.use('/api/v1/auth', userRoutes);
// app.use('/api/v1/profile', profileRoutes);
// app.use('/api/v1/payment', paymentRoutes);
// app.use('/api/v1/course', courseRoutes);
// app.use('/api/v1/categories', categoryRoutes);



// // Default Route
// app.get('/', (req, res) => {
//     // console.log('Your server is up and running..!');
//     res.send(`<div>
//     This is Default Route
//     <p>Everything is OK</p>
//     </div>`);
// })