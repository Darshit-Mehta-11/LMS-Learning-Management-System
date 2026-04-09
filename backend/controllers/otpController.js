const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    await OTP.create({ email, otp });

    try {
      await mailSender(email, "Your OTP", `<h2>Your OTP is: ${otp}</h2>`);
    } catch (mailError) {
      console.error("Mail sending failed:", mailError.message);
      return res.status(200).json({
        success: true,
        message: "OTP generated but mail failed",
        otp, // testing ke liye frontend ko OTP bhej do
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error while generating OTP:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error while generating OTP",
      error: error.message,
    });
  }
};
// const OTP = require("../models/OTP");
// const otpGenerator = require("otp-generator");
// const mailSender = require("../utils/mailSender");

// exports.sendOTP = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const otp = otpGenerator.generate(6, {
//       upperCaseAlphabets: false,
//       lowerCaseAlphabets: false,
//       specialChars: false,
//     });

//     await OTP.create({ email, otp });

//     await mailSender(
//       email,
//       "Your OTP for Signup/Login",
//       `<h2>Your OTP is: ${otp}</h2>`
//     );

//     return res.status(200).json({
//       success: true,
//       message: "OTP sent successfully",
//     });
//   } catch (error) {
//     console.error("Error while generating/sending OTP:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error while generating OTP",
//       error: error.message,
//     });
//   }
// };
// // const OTP = require("../models/OTP");
// // const otpGenerator = require("otp-generator");
// // const mailSender = require("../utils/mailSender");

// // exports.sendOTP = async (req, res) => {
// //   try {
// //     const { email } = req.body;

// //     // Generate OTP
// //     const otp = otpGenerator.generate(6, {
// //       upperCaseAlphabets: false,
// //       lowerCaseAlphabets: false,
// //       specialChars: false,
// //     });

// //     // Save OTP in DB
// //     await OTP.create({ email, otp });

// //     // Send OTP via email
// //     await mailSender(
// //       email,
// //       "Your OTP for Signup/Login",
// //       `<h2>Your OTP is: ${otp}</h2>`
// //     );

// //     return res.status(200).json({
// //       success: true,
// //       message: "Otp sent successfully",
// //       otp, // testing ke liye response me bhej sakte ho
// //     });
// //   } catch (error) {
// //     console.error("Error while generating/sending OTP:", error);
// //     return res.status(500).json({
// //       success: false,
// //       message: "Error while generating OTP",
// //       error: error.message,
// //     });
// //   }
// // };