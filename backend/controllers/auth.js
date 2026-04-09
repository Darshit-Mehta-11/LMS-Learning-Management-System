// sendOtp , signup , login ,  changePassword
const User = require('./../models/user');
const Profile = require('./../models/profile');
const otpGenerator = require('otp-generator');
const OTP = require('../models/OTP')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cookie = require('cookie');
const mailSender = require('../utils/mailSender');
const otpTemplate = require('../mail/templates/emailVerificationTemplate');
const { passwordUpdated } = require("../mail/templates/passwordUpdate");

// // ================ SEND-OTP For Email Verification ================
// exports.sendOTP = async (req, res) => {
//   try {
//     const { email } = req.body;

//     // check if user already exists
//     const checkUserPresent = await User.findOne({ email });
//     if (checkUserPresent) {
//       console.log("(when otp generate) User already registered");
//       return res.status(401).json({
//         success: false,
//         message: "User is Already Registered",
//       });
//     }

//     // generate OTP
//     const otp = otpGenerator.generate(6, {
//       upperCaseAlphabets: false,
//       lowerCaseAlphabets: false,
//       specialChars: false,
//     });

//     // name for email template
//     const name = email.split("@")[0].split(".").map(part => part.replace(/\d+/g, "")).join(" ");
//     console.log("Generated OTP:", otp);

//     // send otp in mail (if mailSender configured)
//     try {
//       await mailSender(email, "OTP Verification Email", otpTemplate(otp, name));
//     } catch (mailError) {
//       console.log("Mail sending failed, but OTP generated:", mailError.message);
//     }

//     // save OTP in DB
//     await OTP.create({ email, otp });

//     // return response
//     return res.status(200).json({
//       success: true,
//       otp, // ⚠️ testing ke liye response me OTP bhej rahe hain
//       message: "Otp sent successfully",
//     });
//   } catch (error) {
//     console.log("Error while generating Otp - ", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error while generating Otp",
//       error: error.message,
//     });
//   }
// };

// ================ SEND-OTP For Email Verification ================
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // check if user already exists
    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      console.log("(when otp generate) User already registered");
      return res.status(401).json({
        success: false,
        message: "User is Already Registered",
      });
    }

    // generate OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // name for email template
    const name = email.split("@")[0].split(".").map(part => part.replace(/\d+/g, "")).join(" ");
    console.log("Generated OTP:", otp);

    // send otp in mail (if mailSender configured)
    try {
      await mailSender(email, "OTP Verification Email", otpTemplate(otp, name));
    } catch (mailError) {
      console.log("⚠️ Mail sending failed, but OTP generated:", mailError.message);
    }

    // save OTP in DB
    await OTP.create({ email, otp });

    // return response
    return res.status(200).json({
      success: true,
      data: { otp }, // Include OTP in data for frontend if needed, or just for debugging
      message: "Otp sent successfully (check console if email failed)",
    });
  } catch (error) {
    console.log("❌ Error while generating Otp - ", error.message);
    return res.status(500).json({
      success: false,
      message: "Error while generating Otp",
      error: error.message,
    });
  }
};


/// ================ SIGNUP ================
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword,
      accountType, contactNumber, otp } = req.body;

    // validation
    if (!firstName || !lastName || !email || !password || !confirmPassword || !accountType || !otp) {
      return res.status(400).json({
        success: false,
        message: "All fields are required..!"
      });
    }

    // check both pass matches or not
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password & confirm password do not match, Please try again..!"
      });
    }

    // check user already exists
    const checkUserAlreadyExists = await User.findOne({ email });
    if (checkUserAlreadyExists) {
      return res.status(400).json({
        success: false,
        message: "User registered already, go to Login Page"
      });
    }

    // find most recent otp stored for user in DB
    const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });
    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "Otp not found in DB, please try again"
      });
    }

    if (otp !== recentOtp.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid Otp"
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create profile details
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: contactNumber || null
    });

    // approved field logic
    let approved = accountType === "Instructor" ? false : true;

    // create user
    await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      contactNumber,
      accountType, // "Admin" or "User"
      additionalDetails: profileDetails._id,
      approved,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
    });

    return res.status(201).json({
      success: true,
      message: "User Registered Successfully"
    });

  } catch (error) {
    console.log("❌ Error while registering user (signup):", error.message);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered, Please try again..!",
      error: error.message
    });
  }
};



// ================ LOGIN ================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // check user is registered and saved data in DB
    let user = await User.findOne({ email }).populate('additionalDetails');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'You are not registered with us'
      });
    }


    // compare given password and saved password from DB
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log(`DEBUG: Login attempt for ${email}. Match: ${isPasswordMatch}`);
    if (isPasswordMatch) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType // This will help to check whether user have access to route, while authorzation
      };

      // Generate token 
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      user = user.toObject();
      user.token = token;
      user.password = undefined; // we have remove password from object, not DB


      // cookie
      const cookieOptions = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
        httpOnly: true
      }

      res.cookie('token', token, cookieOptions).status(200).json({
        success: true,
        user,
        token,
        message: 'User logged in successfully'
      });
    }
    // password not match
    else {
      return res.status(401).json({
        success: false,
        message: 'Password not matched'
      });
    }
  }

  catch (error) {
    console.log('Error while Login user');
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
      messgae: 'Error while Login user'
    })
  }
}


// ================ CHANGE PASSWORD ================
exports.changePassword = async (req, res) => {
  try {
    // extract data
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    // validation
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(403).json({
        success: false,
        message: 'All fileds are required'
      });
    }

    // get user
    const userDetails = await User.findById(req.user.id);

    // validate old passowrd entered correct or not
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    )

    // if old password not match 
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false, message: "Old password is Incorrect"
      });
    }

    // check both passwords are matched
    if (newPassword !== confirmNewPassword) {
      return res.status(403).json({
        success: false,
        message: 'The password and confirm password do not match'
      })
    }


    // hash password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // update in DB
    const updatedUserDetails = await User.findByIdAndUpdate(req.user.id,
      { password: hashedPassword },
      { new: true });


    // send email
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        'Password for your account has been updated',
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      );
      // console.log("Email sent successfully:", emailResponse);
    }
    catch (error) {
      console.error("Error occurred while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }


    // return success response
    res.status(200).json({
      success: true,
      mesage: 'Password changed successfully'
    });
  }

  catch (error) {
    console.log('Error while changing passowrd');
    console.log(error)
    res.status(500).json({
      success: false,
      error: error.message,
      messgae: 'Error while changing passowrd'
    })
  }
}