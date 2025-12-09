const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/user', authMiddleware, userController.getAllUsers);
router.get('/user/:id', authMiddleware, userController.getUser);
router.get('/profile', authMiddleware, userController.getProfile);

module.exports = router;

