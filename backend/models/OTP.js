const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5 * 60, // The document will be automatically deleted after 5 minutes of its creation time
    }

});

//  function to send email
async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = mailSender(email, 'Verification Email from StudyNotion', otp);
        console.log('Email sent successfully to - ', email);

    }
    catch (error) {
        console.log('Error while sending an email to ', email);
        throw new error;
    }
}

// pre middleware removed to avoid double email sending and arrow function this context issue
// Controller handles email sending explicitly



module.exports = mongoose.model('OTP', OTPSchema);