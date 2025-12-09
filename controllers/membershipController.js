// const Membership = require('../models/membershipSchema');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { membershipValidation, memberLoginValidation } = require('../validation');
// const logger = require('../logger');
// const { ENGLISH_MESSAGE, STATUS_CODES } = require('../util/constant');
// const nodemailer = require('nodemailer');

// // Create a Nodemailer transporter
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.GMAIL_USER,
//         pass: process.env.GMAIL_PASSWORD,
//     },
// });

// // Register a new membership
// const registerMembership = async (req, res) => {
//     // Validate the request body
//     const { error } = membershipValidation(req.body);
//     if (error) {
//         logger.error('Validation error', { message: error.details[0].message });
//         return res.status(STATUS_CODES.BAD_REQUEST).send({
//             code: STATUS_CODES.BAD_REQUEST,
//             message: error.details[0].message,
//             status: "error"
//         });
//     }

//     const { fullName, address, dateOfBirth, gender, phone, email, password, confirmPassword, membershipType, additionalInfo, isDisabled } = req.body;

//     try {
//         // Check if the email is already registered
//         const existingMembership = await Membership.findOne({ email });
//         if (existingMembership) {
//             logger.warn('Registration attempt with existing email', { email });
//             return res.status(STATUS_CODES.BAD_REQUEST).send({
//                 code: STATUS_CODES.BAD_REQUEST,
//                 message: ENGLISH_MESSAGE.CREATE_FAIL,
//                 status: "error"
//             });
//         }

//         // Check if passwords match
//         if (password !== confirmPassword) {
//             logger.warn('Password mismatch', { email });
//             return res.status(STATUS_CODES.BAD_REQUEST).send({
//                 code: STATUS_CODES.BAD_REQUEST,
//                 message: 'Passwords do not match',
//                 status: "error"
//             });
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create a new membership
//         const newMembership = new Membership({
//             fullName,
//             address,
//             dateOfBirth,
//             gender,
//             phone,
//             email,
//             password: hashedPassword,
//             confirmPassword,
//             membershipType,
//             additionalInfo,
//             isDisabled: isDisabled || false
//         });

//         // Save the membership
//         await newMembership.save();

//         // Email options for the admin
//         const adminMailOptions = {
//             from: process.env.GMAIL_USER,
//             to: "snekav371@gmail.com", // Admin email
//             subject: 'A membership registration request is awaiting your approval.',
//             html: `
//                 <div style="font-family: Arial, sans-serif; line-height: 1.5em; color: #333;">
//                     <p>Dear Admin,</p>
//                     <p>A user has submitted a member registration request. Please review and approve the request.</p>
//                     <p>Details are as follows.</p>
//                     <div>
//                     <ul>
//                         <li><strong>Name:</strong> ${fullName}</li>
//                         <li><strong>Email id:</strong> ${email}</li>
//                         <li><strong>Phone:</strong> ${phone}</li>
//                         <li><strong>Date of Birth:</strong> ${new Date(dateOfBirth).toLocaleDateString()}</li>
//                         <li><strong>Gender:</strong> ${gender}</li>
//                         <li><strong>Address:</strong> ${address}</li>
//                         <li><strong>Membership Type:</strong> ${membershipType}</li>
//                         <li><strong>Additional Info:</strong> ${additionalInfo || 'N/A'}</li>
//                     <ul/>
//                     </div>
//                     <p>You can manage the requests through the 
//                         <a href="https://worldtamilsiragam.com/cms" target="_blank">Membership Portal</a>.
//                     </p>
//                     <p style="margin-top: 20px;">Regards,</p>
//                     <p><strong>World Tamil Siragam</strong></p>
//                 </div>
//             `
//         };

//         // Email options for the user
//         const userMailOptions = {
//             from: process.env.GMAIL_USER,
//             to: email, // Send to user's email
//             subject: 'Membership registration request is awaiting admin approval.',
//             html: `
//                 <div style="font-family: Arial, sans-serif; line-height: 1.5em; color: #333;">
//                     <p>Dear User,</p>
//                     <p>Thank you for your interest in World Tamil Siragam. Your membership registration request has been taken. 
//                     Please wait for admin's approval</p>
//                     <p>Please visit our website and contact one of our administrators for any questions</p>
//                     <p style="margin-top: 20px;">Regards,</p>
//                     <p><strong>World Tamil Siragam</strong></p>
//                     <a href="https://worldtamilsiragam.com" target="_blank">https://worldtamilsiragam.com</a>
//                 </div>
//             `
//         };

//         // Send both emails
//         await transporter.sendMail(adminMailOptions);
//         await transporter.sendMail(userMailOptions);

//         logger.info('Membership registered successfully', { membershipId: newMembership._id });

//         res.status(STATUS_CODES.SUCCESS).send({
//             code: STATUS_CODES.SUCCESS,
//             message: ENGLISH_MESSAGE.CREATE_SUCC,
//             data: newMembership,
//             status: "success"
//         });

//     } catch (error) {
//         logger.error('Registration failed', { error: error.message });
//         res.status(STATUS_CODES.SERVER_ERROR).send({
//             code: STATUS_CODES.SERVER_ERROR,
//             message: ENGLISH_MESSAGE.CREATE_FAIL,
//             status: "error"
//         });
//     }
// };


// // Login membership
// const loginMembership = async (req, res) => {
//     // Step 1: Validate the request body
//     const { error } = memberLoginValidation(req.body);
//     if (error) {
//         logger.error('Validation error', { message: error.details[0].message });
//         return res.status(STATUS_CODES.BAD_REQUEST).json({
//             code: STATUS_CODES.BAD_REQUEST,
//             message: error.details[0].message,
//             status: 'error'
//         });
//     }

//     try {
//         const { email, password } = req.body;

//         // Step 2: Find the user by email
//         const user = await Membership.findOne({ email });
//         if (!user) {
//             logger.warn('Authentication failed. User not found', { email });
//             return res.status(STATUS_CODES.NOT_FOUND).json({
//                 code: STATUS_CODES.NOT_FOUND,
//                 message: 'Email not found',
//                 status: 'error'
//             });
//         }

//         // Step 3: Check if the account is disabled
//         if (!user.isDisabled) {
//             logger.warn('Authentication failed. Account is disabled', { email });
//             return res.status(STATUS_CODES.FORBIDDEN).json({
//                 code: STATUS_CODES.FORBIDDEN,
//                 message: 'You are not a member. Please get in touch with support.',
//                 status: 'error'
//             });
//         }

//         // Step 4: Restrict login to Directors only
//         if (user.membershipType !== 'இயக்குனர்கள் / Directors') {
//             logger.warn('Authentication failed. Not authorized', { email });
//             return res.status(STATUS_CODES.UNAUTHORIZED).json({
//                 code: STATUS_CODES.UNAUTHORIZED,
//                 message: 'Only Directors can log in.',
//                 status: 'error'
//             });
//         }

//         // Step 5: Compare the provided password with the stored hashed password
//         const passwordMatch = await bcrypt.compare(password, user.password);
//         if (!passwordMatch) {
//             logger.warn('Authentication failed. Incorrect password', { email });
//             return res.status(STATUS_CODES.UNAUTHORIZED).json({
//                 code: STATUS_CODES.UNAUTHORIZED,
//                 message: 'Incorrect password',
//                 status: 'error'
//             });
//         }

//         // Step 6: Generate a JWT token
//         const token = jwt.sign(
//             { userId: user._id, membershipType: user.membershipType },
//             process.env.JWT_SECRET,
//             { expiresIn: '1h' }
//         );

//         logger.info('User login successful', { userId: user._id });
//         return res.status(STATUS_CODES.SUCCESS).json({
//             message: 'Login successful',
//             token,
//             membershipType: user.membershipType,
//             user: {
//                 fullName: user.fullName,
//                 email: user.email,
//                 phone: user.phone,
//                 gender: user.gender,
//                 dateOfBirth: user.dateOfBirth,
//                 membershipType: user.membershipType,
//                 address: user.address
//             },
//             status: "success"
//         });
//     } catch (error) {
//         logger.error('Login failed', { error: error.message });
//         return res.status(STATUS_CODES.SERVER_ERROR).json({
//             code: STATUS_CODES.SERVER_ERROR,
//             message: 'Login failed',
//             status: 'error',
//             details: error.message
//         });
//     }
// };


// // Get all members
// const getAllMembers = async (req, res) => {
//     try {
//         const members = await Membership.find();
//         logger.info('Retrieved all members');

//         res.status(STATUS_CODES.SUCCESS).send({
//             code: STATUS_CODES.SUCCESS,
//             message: ENGLISH_MESSAGE.GET_SUCC,
//             data: members,
//             status: "success"
//         });
//     } catch (error) {
//         logger.error('Error retrieving members', { error: error.message });

//         res.status(STATUS_CODES.SERVER_ERROR).send({
//             code: STATUS_CODES.SERVER_ERROR,
//             message: ENGLISH_MESSAGE.GET_FAIL,
//             status: "error"
//         });
//     }
// };


// // Update a member by ID
// const updateMember = async (req, res) => {
//     const { id } = req.params;

//     try {
//         // Retrieve the existing member data
//         const existingMember = await Membership.findById(id);
//         if (!existingMember) {
//             logger.warn('Member not found', { memberId: id });
//             return res.status(STATUS_CODES.NOT_FOUND).send({
//                 code: STATUS_CODES.NOT_FOUND,
//                 message: ENGLISH_MESSAGE.UPDATE_FAIL,
//                 status: "error"
//             });
//         }

//         const {
//             fullName = existingMember?.fullName, address, dateOfBirth, gender, phone,
//             email = existingMember?.email, // Use the existing email if req.body.email is missing
//             membershipType, additionalInfo, isDisabled
//         } = req.body;
//         // Log current and new `isDisabled` values
//         logger.info(`Existing isDisabled: ${existingMember.isDisabled}, New isDisabled: ${isDisabled}`, { memberId: id });

//         // Update the member details
//         const updatedMember = await Membership.findByIdAndUpdate(
//             id,
//             { fullName, address, dateOfBirth, gender, phone, email, membershipType, additionalInfo, isDisabled },
//             { new: true, runValidators: true }
//         );

//         logger.info('Member updated successfully', { memberId: id });

//         // Send email if `isDisabled` changed from `false` to `true`
//         if (existingMember.isDisabled === false && isDisabled === true) {
//             if (email) {  // Ensure email is defined
//                 logger.info(`Sending email notification to: ${email}`, { memberId: id });

//                 const mailOptions = {
//                     from: process.env.GMAIL_USER,
//                     to: email,
//                     subject: 'Your membership registration request approved.',
//                     html: `
//                     <div style="font-family: Arial, sans-serif; line-height: 1.5em; color: #333;">
//                         <p>உலகத் தமிழ்ச் சிறகம் உங்களை அன்புடன் வரவேற்கிறது. உங்களின் உறுப்பினர் பதிவு கோரிக்கை 
//                         ஏற்கப்பட்டது. உங்களின் கேள்விகளுக்கு எங்கள் நிர்வாகிகளில் ஒருவரைத் தொடர்பு கொள்ளவும்.</p>
//                         <p style="margin-top: 20px;">அன்புடன்,</p>
//                         <p><strong>உலகத் தமிழ்ச் சிறகம்</strong></p>
//                         <a href="https://worldtamilsiragam.com" target="_blank">https://worldtamilsiragam.com</a>
//                     </div>
//                     `
//                 };

//                 // Send the email
//                 await transporter.sendMail(mailOptions);
//                 logger.info('Email sent successfully', { memberId: id });
//             } else {
//                 logger.warn("No recipient email defined for notification", { memberId: id });
//             }
//         }

//         res.status(STATUS_CODES.SUCCESS).send({
//             code: STATUS_CODES.SUCCESS,
//             message: ENGLISH_MESSAGE.UPDATE_SUCC,
//             data: updatedMember,
//             status: "success"
//         });

//     } catch (error) {
//         logger.error('Error updating member', { error: error.message });
//         res.status(STATUS_CODES.SERVER_ERROR).send({
//             code: STATUS_CODES.SERVER_ERROR,
//             message: ENGLISH_MESSAGE.UPDATE_FAIL,
//             status: "error"
//         });
//     }
// };


// // Delete a member by ID
// const deleteMembership = async (req, res) => {
//     const { id } = req.params;

//     try {
//         // Find and delete the member by ID
//         const deletedMember = await Membership.findByIdAndDelete(id);

//         // If member is not found
//         if (!deletedMember) {
//             logger.warn('Member not found for deletion', { memberId: id });
//             return res.status(STATUS_CODES.NOT_FOUND).send({
//                 code: STATUS_CODES.NOT_FOUND,
//                 message: ENGLISH_MESSAGE.DELETE_FAIL,
//                 status: "error"
//             });
//         }

//         // Log success and send response
//         logger.info('Member deleted successfully', { memberId: id });
//         res.status(STATUS_CODES.SUCCESS).send({
//             code: STATUS_CODES.SUCCESS,
//             message: ENGLISH_MESSAGE.DELETE_SUCC,
//             data: deletedMember,
//             status: "success"
//         });
//     } catch (error) {
//         logger.error('Error deleting member', { error: error.message });

//         res.status(STATUS_CODES.SERVER_ERROR).send({
//             code: STATUS_CODES.SERVER_ERROR,
//             message: ENGLISH_MESSAGE.DELETE_FAIL,
//             status: "error"
//         });
//     }
// };

// // Forgot Password
// const forgotPassword = async (req, res) => {
//     const { email } = req.body;

//     try {
//         // Check if the user exists with the provided email
//         const user = await Membership.findOne({ email });
//         if (!user) {
//             logger.warn('Password reset requested for non-existent email', { email });
//             return res.status(STATUS_CODES.NOT_FOUND).send({
//                 code: STATUS_CODES.NOT_FOUND,
//                 message: 'User not found',
//                 status: 'error'
//             });
//         }

//         // Generate a password reset token and its expiration time
//         const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         user.resetToken = resetToken;
//         user.resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour
//         await user.save();

//         // Send password reset email
//         const resetLink = `https://worldtamilsiragam.com/resetpassword?token=${resetToken}`;
//         // const resetLink = `http://localhost:3000/resetpassword?token=${resetToken}`;
//         const mailOptions = {
//             from: process.env.GMAIL_USER,
//             to: email,
//             subject: 'Forgot Password Link',
//             html: `
//                 <p>Hello ${user.fullName},</p>
//                 <p>We have received a request to reset your password. Please reset your password using the link below.</p>
//                 <button style=" background-color: #281E5D; color: white; font-weight: bold; padding: 0.5rem 1rem; border: none; outline: none; cursor: pointer; display: inline-block;">
//                 <a href="${resetLink}" style="color: white; text-decoration: none; display: inline-block; width: 100%; text-align: center;">Reset Password</a>
//                 </button>
//                 <p>This link will expire in one hour.</p>
//                 <p>If you did not request this reset, please ignore this email.</p>
//                 <p>Regards,<br/>World Tamil Siragam</p>
//             `
//         };
//         await transporter.sendMail(mailOptions);
//         logger.info('Password reset email sent', { email });

//         res.status(STATUS_CODES.SUCCESS).send({
//             code: STATUS_CODES.SUCCESS,
//             message: 'Password reset link sent to your email',
//             status: 'success'
//         });
//     } catch (error) {
//         logger.error('Password reset failed', { error: error.message });
//         res.status(STATUS_CODES.SERVER_ERROR).send({
//             code: STATUS_CODES.SERVER_ERROR,
//             message: 'Failed to send password reset link',
//             status: 'error'
//         });
//     }
// };

// const resetPassword = async (req, res) => {
//     const { newPassword, confirmNewPassword } = req.body;  // Only take passwords from req.body
//     const { token } = req.query;  // Retrieve token from query parameters

//     if (!token) {
//         logger.warn('Token not provided');
//         return res.status(STATUS_CODES.BAD_REQUEST).send({
//             code: STATUS_CODES.BAD_REQUEST,
//             message: 'Token must be provided',
//             status: 'error',
//         });
//     }

//     try {
//         // Decode and verify the token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const userId = decoded.userId;

//         // Find the user and check if the token is still valid
//         const user = await Membership.findOne({
//             _id: userId,
//             resetToken: token,
//             resetTokenExpiration: { $gt: Date.now() },
//         });

//         if (!user) {
//             logger.warn('Invalid or expired reset token');
//             return res.status(STATUS_CODES.BAD_REQUEST).send({
//                 code: STATUS_CODES.BAD_REQUEST,
//                 message: 'Invalid or expired reset token',
//                 status: 'error',
//             });
//         }

//         // Check if the new passwords match
//         if (newPassword !== confirmNewPassword) {
//             return res.status(STATUS_CODES.BAD_REQUEST).send({
//                 code: STATUS_CODES.BAD_REQUEST,
//                 message: 'Passwords do not match',
//                 status: 'error',
//             });
//         }

//         // Hash the new password and update it
//         const hashedPassword = await bcrypt.hash(newPassword, 10);
//         user.password = hashedPassword;
//         user.resetToken = undefined; // Clear the reset token
//         user.resetTokenExpiration = undefined; // Clear the token expiration
//         await user.save();

//         logger.info('Password reset successfully', { userId: user._id });

//         res.status(STATUS_CODES.SUCCESS).send({
//             code: STATUS_CODES.SUCCESS,
//             message: 'Password reset successful',
//             status: 'success',
//         });
//     } catch (error) {
//         logger.error('Password reset failed', { error: error.message });
//         res.status(STATUS_CODES.SERVER_ERROR).send({
//             code: STATUS_CODES.SERVER_ERROR,
//             message: 'Password reset failed',
//             status: 'error',
//         });
//     }
// };



// // Export controller methods
// module.exports = {
//     registerMembership,
//     loginMembership,
//     getAllMembers,
//     updateMember,
//     deleteMembership,
//     forgotPassword,
//     resetPassword
// };


const Membership = require('../models/membershipSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { membershipValidation, memberLoginValidation } = require('../validation');
const logger = require('../logger');
const { ENGLISH_MESSAGE, STATUS_CODES } = require('../util/constant');
const nodemailer = require('nodemailer');
const sequelize = require('../config/db');
const { Op } = require('sequelize');  

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
    },
});

// Register a new membership
const registerMembership = async (req, res) => {
    const { error } = membershipValidation(req.body);
    if (error) {
        logger.error('Validation error', { message: error.details[0].message });
        return res.status(STATUS_CODES.BAD_REQUEST).send({
            code: STATUS_CODES.BAD_REQUEST,
            message: error.details[0].message,
            status: "error"
        });
    }

    const { fullName, address, dateOfBirth, gender, phone, email, password, confirmPassword, membershipType, additionalInfo, isDisabled } = req.body;

    const transaction = await sequelize.transaction(); // Start transaction

    try {
        // Check if the email already exists
        const existingMembership = await Membership.findOne({ where: { email } });
        if (existingMembership) {
            logger.warn('Registration attempt with existing email', { email });
            return res.status(STATUS_CODES.BAD_REQUEST).send({
                code: STATUS_CODES.BAD_REQUEST,
                message: ENGLISH_MESSAGE.CREATE_FAIL,
                status: "error"
            });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            logger.warn('Password mismatch', { email });
            return res.status(STATUS_CODES.BAD_REQUEST).send({
                code: STATUS_CODES.BAD_REQUEST,
                message: 'Passwords do not match',
                status: "error"
            });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new membership record
        const newMembership = await Membership.create({
            fullName,
            address,
            dateOfBirth,
            gender,
            phone,
            email,
            password: hashedPassword, // Store only hashed password
            membershipType,
            additionalInfo,
            isDisabled: isDisabled || false
        }, { transaction });

        await transaction.commit(); // Commit transaction

        const adminMailOptions = {
            from: process.env.GMAIL_USER,
            to: "tamilsiragam@gmail.com",
            subject: 'A membership registration request is awaiting your approval.',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.5em; color: #333;">
                    <p>Dear Admin,</p>
                    <p>A user has submitted a membership registration request. Please review and approve the request.</p>
                    <p>Details:</p>
                    <ul>
                        <li><strong>Name:</strong> ${fullName}</li>
                        <li><strong>Email:</strong> ${email}</li>
                        <li><strong>Phone:</strong> ${phone}</li>
                        <li><strong>Date of Birth:</strong> ${new Date(dateOfBirth).toLocaleDateString()}</li>
                        <li><strong>Gender:</strong> ${gender}</li>
                        <li><strong>Address:</strong> ${address}</li>
                        <li><strong>Membership Type:</strong> ${membershipType}</li>
                        <li><strong>Additional Info:</strong> ${additionalInfo || 'N/A'}</li>
                    </ul>
                    <p>Manage requests through the 
                        <a href="https://worldtamilsiragam.com/cms" target="_blank">Membership Portal</a>.
                    </p>
                    <p>Regards,<br><strong>World Tamil Siragam</strong></p>
                </div>
            `
        };

        const userMailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Membership registration request is awaiting admin approval.',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.5em; color: #333;">
                    <p>Dear User,</p>
                    <p>Thank you for your interest in World Tamil Siragam. Your membership registration request has been received. 
                    Please wait for admin approval.</p>
                    <p>Please visit our website and contact one of our administrators for any questions.</p>
                    <p>Regards,<br><strong>World Tamil Siragam</strong></p>
                    <a href="https://worldtamilsiragam.com" target="_blank">https://worldtamilsiragam.com</a>
                </div>
            `
        };

        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(userMailOptions);

        logger.info('Membership registered successfully', { membershipId: newMembership.id });

        res.status(STATUS_CODES.SUCCESS).send({
            code: STATUS_CODES.SUCCESS,
            message: ENGLISH_MESSAGE.CREATE_SUCC,
            data: newMembership,
            status: "success"
        });

    } catch (error) {
        await transaction.rollback(); // Rollback transaction on error
        logger.error('Registration failed', { error: error.message });
        res.status(STATUS_CODES.SERVER_ERROR).send({
            code: STATUS_CODES.SERVER_ERROR,
            message: ENGLISH_MESSAGE.CREATE_FAIL,
            status: "error"
        });
    }
};


// Login membership
const loginMembership = async (req, res) => {
    // Step 1: Validate the request body
    const { error } = memberLoginValidation(req.body);
    if (error) {
        logger.error('Validation error', { message: error.details[0].message });
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            code: STATUS_CODES.BAD_REQUEST,
            message: error.details[0].message,
            status: 'error'
        });
    }

    try {
        const { email, password } = req.body;

        // Step 2: Find the user by email
        const user = await Membership.findOne({ where: { email } });

        if (!user) {
            logger.warn('Authentication failed. User not found', { email });
            return res.status(STATUS_CODES.NOT_FOUND).json({
                code: STATUS_CODES.NOT_FOUND,
                message: 'Email not found',
                status: 'error'
            });
        }

        // Step 3: Check if the account is disabled
        if (!user.isDisabled) {
            logger.warn('Authentication failed. Account is disabled', { email });
            return res.status(STATUS_CODES.FORBIDDEN).json({
                code: STATUS_CODES.FORBIDDEN,
                message: 'You are not a member. Please get in touch with support.',
                status: 'error'
            });
        }

        // Step 4: Restrict login to Directors only
        if (user.membershipType !== 'இயக்குனர்கள் / Directors') {
            logger.warn('Authentication failed. Not authorized', { email });
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                code: STATUS_CODES.UNAUTHORIZED,
                message: 'Only Directors can log in.',
                status: 'error'
            });
        }

        // Step 5: Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            logger.warn('Authentication failed. Incorrect password', { email });
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                code: STATUS_CODES.UNAUTHORIZED,
                message: 'Incorrect password',
                status: 'error'
            });
        }

        // Step 6: Generate a JWT token
        const token = jwt.sign(
            { userId: user.id, membershipType: user.membershipType },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        logger.info('User login successful', { userId: user.id });

        return res.status(STATUS_CODES.SUCCESS).json({
            message: 'Login successful',
            token,
            membershipType: user.membershipType,
            user: {
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                gender: user.gender,
                dateOfBirth: user.dateOfBirth,
                membershipType: user.membershipType,
                address: user.address
            },
            status: "success"
        });

    } catch (error) {
        logger.error('Login failed', { error: error.message });
        return res.status(STATUS_CODES.SERVER_ERROR).json({
            code: STATUS_CODES.SERVER_ERROR,
            message: 'Login failed',
            status: 'error',
            details: error.message
        });
    }
};

// Get all members
const getAllMembers = async (req, res) => {
    try {
        // Fetch all members using Sequelize's findAll method
        const members = await Membership.findAll();

        logger.info('Retrieved all members');

        res.status(STATUS_CODES.SUCCESS).send({
            code: STATUS_CODES.SUCCESS,
            message: ENGLISH_MESSAGE.GET_SUCC,
            data: members,
            status: "success"
        });
    } catch (error) {
        logger.error('Error retrieving members', { error: error.message });

        res.status(STATUS_CODES.SERVER_ERROR).send({
            code: STATUS_CODES.SERVER_ERROR,
            message: ENGLISH_MESSAGE.GET_FAIL,
            status: "error"
        });
    }
};

// Update a member by ID
const updateMember = async (req, res) => {
    const { id } = req.params;

    try {
        const existingMember = await Membership.findByPk(id);
        if (!existingMember) {
            logger.warn('Member not found', { memberId: id });
            return res.status(STATUS_CODES.NOT_FOUND).send({
                code: STATUS_CODES.NOT_FOUND,
                message: ENGLISH_MESSAGE.UPDATE_FAIL,
                status: "error"
            });
        }

        const {
            fullName = existingMember.fullName,
            address,
            dateOfBirth,
            gender,
            phone,
            email = existingMember.email,
            membershipType,
            additionalInfo,
            isDisabled
        } = req.body;

        const isDisabledBool = isDisabled == 1 || isDisabled === "1" || isDisabled === true;
        const existingIsDisabledBool = existingMember.isDisabled == 1;  

        logger.info(`Existing isDisabled: ${existingIsDisabledBool}, New isDisabled: ${isDisabledBool}`, { memberId: id });

        await existingMember.update({
            fullName, 
            address, 
            dateOfBirth, 
            gender, 
            phone, 
            email, 
            membershipType, 
            additionalInfo, 
            isDisabled: isDisabledBool ? 1 : 0  
        });

        logger.info('Member updated successfully', { memberId: id });

        if (existingIsDisabledBool === false && isDisabledBool) {
            if (email) {
                logger.info(`Sending email notification to: ${email}`, { memberId: id });

                const mailOptions = {
                    from: process.env.GMAIL_USER,
                    to: email,
                    subject: 'Your membership registration request approved.',
                    html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.5em; color: #333;">
                        <p>உலகத் தமிழ்ச் சிறகம் உங்களை அன்புடன் வரவேற்கிறது. உங்களின் உறுப்பினர் பதிவு கோரிக்கை 
                        ஏற்கப்பட்டது. உங்களின் கேள்விகளுக்கு எங்கள் நிர்வாகிகளில் ஒருவரைத் தொடர்பு கொள்ளவும்.</p>
                        <p style="margin-top: 20px;">அன்புடன்,</p>
                        <p><strong>உலகத் தமிழ்ச் சிறகம்</strong></p>
                        <a href="https://worldtamilsiragam.com" target="_blank">https://worldtamilsiragam.com</a>
                    </div>
                    `
                };

                await transporter.sendMail(mailOptions);
                logger.info('Email sent successfully', { memberId: id });
            } else {
                logger.warn("No recipient email defined for notification", { memberId: id });
            }
        }

        res.status(STATUS_CODES.SUCCESS).send({
            code: STATUS_CODES.SUCCESS,
            message: ENGLISH_MESSAGE.UPDATE_SUCC,
            data: existingMember,
            status: "success"
        });

    } catch (error) {
        logger.error('Error updating member', { error: error.message });
        res.status(STATUS_CODES.SERVER_ERROR).send({
            code: STATUS_CODES.SERVER_ERROR,
            message: ENGLISH_MESSAGE.UPDATE_FAIL,
            status: "error"
        });
    }
};


// Delete a member by ID
const deleteMembership = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the member by ID
        const deletedMember = await Membership.findByPk(id);

        // If member is not found
        if (!deletedMember) {
            logger.warn('Member not found for deletion', { memberId: id });
            return res.status(STATUS_CODES.NOT_FOUND).send({
                code: STATUS_CODES.NOT_FOUND,
                message: ENGLISH_MESSAGE.DELETE_FAIL,
                status: "error"
            });
        }

        // Delete the member
        await deletedMember.destroy();

        // Log success and send response
        logger.info('Member deleted successfully', { memberId: id });
        res.status(STATUS_CODES.SUCCESS).send({
            code: STATUS_CODES.SUCCESS,
            message: ENGLISH_MESSAGE.DELETE_SUCC,
            data: deletedMember, // Optionally return deleted member details
            status: "success"
        });
    } catch (error) {
        logger.error('Error deleting member', { error: error.message });

        res.status(STATUS_CODES.SERVER_ERROR).send({
            code: STATUS_CODES.SERVER_ERROR,
            message: ENGLISH_MESSAGE.DELETE_FAIL,
            status: "error"
        });
    }
};

// Forgot Password
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the user exists with the provided email using Sequelize
        const user = await Membership.findOne({ where: { email } });
        if (!user) {
            logger.warn('Password reset requested for non-existent email', { email });
            return res.status(STATUS_CODES.NOT_FOUND).send({
                code: STATUS_CODES.NOT_FOUND,
                message: 'User not found',
                status: 'error'
            });
        }

        // Generate a password reset token and its expiration time
        const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log("Reset Token:", resetToken);

        
        // Store reset token and expiration in the database
        user.resetToken = resetToken;
        user.resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour
        
        // Update the user record in the database
        await user.save();

        // Send password reset email
        const resetLink = `https://worldtamilsiragam.com/resetpassword?token=${resetToken}`;
        // const resetLink = `http://localhost:3000/resetpassword?token=${resetToken}`;
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Forgot Password Link',
            html: `
                <p>Hello ${user.fullName},</p>
                <p>We have received a request to reset your password. Please reset your password using the link below.</p>
                <button style=" background-color: #281E5D; color: white; font-weight: bold; padding: 0.5rem 1rem; border: none; outline: none; cursor: pointer; display: inline-block;">
                <a href="${resetLink}" style="color: white; text-decoration: none; display: inline-block; width: 100%; text-align: center;">Reset Password</a>
                </button>
                <p>This link will expire in one hour.</p>
                <p>If you did not request this reset, please ignore this email.</p>
                <p>Regards,<br/>World Tamil Siragam</p>
            `
        };
        await transporter.sendMail(mailOptions);
        logger.info('Password reset email sent', { email });

        res.status(STATUS_CODES.SUCCESS).send({
            code: STATUS_CODES.SUCCESS,
            message: 'Password reset link sent to your email',
            status: 'success'
        });
    } catch (error) {
        logger.error('Password reset failed', { error: error.message });
        res.status(STATUS_CODES.SERVER_ERROR).send({
            code: STATUS_CODES.SERVER_ERROR,
            message: 'Failed to send password reset link',
            status: 'error'
        });
    }
};

//Reset Password
const resetPassword = async (req, res) => {
    const { newPassword, confirmNewPassword } = req.body;
    const token = req.query.token || req.body.token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        logger.warn('Token not provided');
        return res.status(STATUS_CODES.BAD_REQUEST).send({
            code: STATUS_CODES.BAD_REQUEST,
            message: 'Token must be provided',
            status: 'error',
        });
    }

    try {
        // Decode and verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Find the user using the primary key (userId) and check if the token is still valid
        const user = await Membership.findOne({
            where: {
                id: userId,
                resetToken: token,
                resetTokenExpiration: { [Op.gt]: Date.now() },
            },
        });

        if (!user) {
            logger.warn('Invalid or expired reset token');
            return res.status(STATUS_CODES.BAD_REQUEST).send({
                code: STATUS_CODES.BAD_REQUEST,
                message: 'Invalid or expired reset token',
                status: 'error',
            });
        }

        // Check if the new passwords match
        if (newPassword !== confirmNewPassword) {
            return res.status(STATUS_CODES.BAD_REQUEST).send({
                code: STATUS_CODES.BAD_REQUEST,
                message: 'Passwords do not match',
                status: 'error',
            });
        }

        // Hash the new password and update it
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password, and clear the reset token and expiration
        await user.update({
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiration: null,
        });

        logger.info('Password reset successfully', { userId: user.id });

        res.status(STATUS_CODES.SUCCESS).send({
            code: STATUS_CODES.SUCCESS,
            message: 'Password reset successful',
            status: 'success',
        });
    } catch (error) {
        logger.error('Password reset failed', { error: error.message });
        res.status(STATUS_CODES.SERVER_ERROR).send({
            code: STATUS_CODES.SERVER_ERROR,
            message: 'Password reset failed',
            status: 'error',
        });
    }
};


// Export controller methods
module.exports = {
    registerMembership,
    loginMembership,
    getAllMembers,
    updateMember,
    deleteMembership,
    forgotPassword,
    resetPassword
};


