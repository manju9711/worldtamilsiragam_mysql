
const nodeMail = require("nodemailer");
const Contactform = require('../models/contactformSchema.js');
const logger = require('../logger');
const { STATUS_CODES, CONTACT_FORM } = require("../util/constant.js");
require('dotenv').config();

// Create Contact Form
const createContactForm = async (req, res) => {
    const { name, email, mobile, subject, message, status = 'New' } = req.body;

    try {
        // Create a new contact form using Sequelize
        const contactUser = await Contactform.create({
            name,
            email,
            mobile,
            subject,
            message,
            status
        });

        // Setup the email transporter
        const transporter = nodeMail.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASSWORD, 
            },
        });

        // Mail options
        const mailOptions = {
            from: email,
            to: "tamilsiragam@gmail.com",
            subject: `Message from ${name}`,
            html: `
                You got a message from <br>
                Email: ${email}<br>
                Name: ${name}<br>
                Mobile: ${mobile}<br>
                Subject: ${subject}<br>
                Message: ${message}
            `,
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);

        logger.info(`Email sent: ${info.response}`, { statusCode: STATUS_CODES.SUCCESS });
        logger.info(`Contact user added: ${name}`, { statusCode: STATUS_CODES.SUCCESS });

        res.status(STATUS_CODES.SUCCESS).json({ contactUser, msg: CONTACT_FORM.SUCCESS });
    } catch (error) {
        logger.error(`Error creating contact user: ${error.message}`, { statusCode: STATUS_CODES.SERVER_ERROR });
        res.status(STATUS_CODES.SERVER_ERROR).json({ error: "An error occurred" });
    }
};

// Get all Contact Forms
const getContactForms = async (req, res) => {
    try {
        // Find all contact forms using Sequelize
        const contactForms = await Contactform.findAll();
        res.status(STATUS_CODES.SUCCESS).json(contactForms);
    } catch (error) {
        logger.error(`Error retrieving contact forms: ${error.message}`, { statusCode: STATUS_CODES.SERVER_ERROR });
        res.status(STATUS_CODES.SERVER_ERROR).json({ error: CONTACT_FORM.RETRIVE_ERROR });
    }
};

// Update a Contact Form
const updateContactForm = async (req, res) => {
    const { id } = req.params;
    const { name, email, mobile, subject, message, status } = req.body;

    try {
        // Find the contact form by id and update it using Sequelize
        const [updatedCount, updatedContactForm] = await Contactform.update(
            {
                name,
                email,
                mobile,
                subject,
                message,
                status,
            },
            {
                where: { id }, 
                returning: true, 
                plain: true, 
            }
        );

        if (updatedCount === 0) {
            return res.status(STATUS_CODES.NOT_FOUND).json({ error: CONTACT_FORM.NOT_FOUND });
        }

        res.status(STATUS_CODES.SUCCESS).json(updatedContactForm);
    } catch (error) {
        logger.error(`Error updating contact form: ${error.message}`, { statusCode: STATUS_CODES.SERVER_ERROR });
        res.status(STATUS_CODES.SERVER_ERROR).json({ error: CONTACT_FORM.UPDATE_ERROR });
    }
};


module.exports = {
    createContactForm,
    getContactForms,
    updateContactForm
};
