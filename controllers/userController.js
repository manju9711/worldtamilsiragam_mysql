
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const  User  = require('../models/userSchema'); // Import Sequelize models
const  Role  = require('../models/roleSchema'); 
const { registerValidation, loginValidation } = require('../validation');
require('dotenv').config();
const logger = require('../logger');
const { ENGLISH_MESSAGE, STATUS_CODES } = require('../util/constant');

// User Registration
const registerUser = async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) {
        logger.error('Validation error: ', { message: error.details[0].message });
        return res.status(STATUS_CODES.BAD_REQUEST).json({ error: error.details[0].message });
    }
    try {
        const { name, email, password, mobile, role_id } = req.body;
        
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            logger.warn('Registration attempt with existing email', { email });
            return res.status(STATUS_CODES.BAD_REQUEST).json({ error: ENGLISH_MESSAGE.CREATE_FAIL });
        }

        const role = await Role.findByPk(role_id);
        if (!role) {
            logger.warn('Invalid role selected', { role_id });
            return res.status(STATUS_CODES.BAD_REQUEST).json({ error: ENGLISH_MESSAGE.CREATE_FAIL });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            mobile,
            role_id
        });

        logger.info('User registered successfully', { userId: user.id });
        res.status(STATUS_CODES.SUCCESS).json({ message: ENGLISH_MESSAGE.CREATE_SUCC, user });
    } catch (error) {
        logger.error('Registration failed', { error: error.message });
        res.status(STATUS_CODES.SERVER_ERROR).json({ error: ENGLISH_MESSAGE.CREATE_FAIL, details: error.message });
    }
};

// User Login
const loginUser = async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) {
        logger.error('Validation error: ', { message: error.details[0].message });
        return res.status(STATUS_CODES.BAD_REQUEST).json({ error: error.details[0].message });
    }
    try {
        const { email, password } = req.body;
        const user = await User.findOne({
            where: { email },
            include: {
                model: Role,
                as: 'role', 
                required: true  
            }
        });
        
        if (!user) {
            logger.warn('Authentication failed. User not found', { email });
            return res.status(STATUS_CODES.NOT_FOUND).json({ error: ENGLISH_MESSAGE.GET_FAIL });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            logger.warn('Authentication failed. Incorrect password', { email });
            return res.status(STATUS_CODES.NOT_FOUND).json({ error: ENGLISH_MESSAGE.GET_FAIL });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role.role_name },  // ✅ Correct alias
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        logger.info('User login successful', { userId: user.id });
        res.status(STATUS_CODES.SUCCESS).json({ 
            message: ENGLISH_MESSAGE.GET_SUCC, 
            token, 
            role: user.role,  // ✅ Correct alias
            user 
        });
    } catch (error) {
        logger.error('Login failed', { error: error.message });
        res.status(STATUS_CODES.SERVER_ERROR).json({ error: ENGLISH_MESSAGE.GET_FAIL, details: error.message });
    }
};


// Get All Users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            include: { model: Role, as: 'role' }  
        });

        logger.info('Fetched all users');
        res.status(STATUS_CODES.SUCCESS).json({ users });
    } catch (error) {
        logger.error('Error getting users', { error: error.message });
        res.status(STATUS_CODES.SERVER_ERROR).json({ error: ENGLISH_MESSAGE.GET_FAIL, details: error.message });
    }
};


// Get User By ID
const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            include: { model: Role, as: 'role' }  
        });

        if (!user) {
            logger.warn('User not found', { userId: id });
            return res.status(STATUS_CODES.NOT_FOUND).json({ error: ENGLISH_MESSAGE.GET_BY_ID_FAIL });
        }

        logger.info('Fetched user by ID', { userId: id });
        res.status(STATUS_CODES.SUCCESS).json({ user });
    } catch (error) {
        logger.error('Error getting user', { error: error.message });
        res.status(STATUS_CODES.SERVER_ERROR).json({ error: ENGLISH_MESSAGE.GET_BY_ID_FAIL, details: error.message });
    }
};


// Get Profile
const getProfile = async (req, res) => {
    try {
        const { userId } = req.user;  // Extract userId from authenticated request
        const user = await User.findByPk(userId, {
            include: { model: Role, as: 'role' } 
        });

        if (!user) {
            logger.warn('User not found', { userId });
            return res.status(STATUS_CODES.NOT_FOUND).json({ error: ENGLISH_MESSAGE.GET_FAIL });
        }

        logger.info('Fetched user profile', { userId });
        res.status(STATUS_CODES.SUCCESS).json({ user });
    } catch (error) {
        logger.error('Error accessing profile', { error: error.message });
        res.status(STATUS_CODES.SERVER_ERROR).json({ error: ENGLISH_MESSAGE.GET_FAIL, details: error.message });
    }
};


module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getUser,
    getProfile
};
