const express = require('express');
const membershipController = require('../controllers/membershipController');

const router = express.Router();

// Registration Route
router.post('/membershipregister', membershipController.registerMembership);
router.post('/membershiplogin', membershipController.loginMembership);
router.get('/membership', membershipController.getAllMembers);
router.put('/membership/:id', membershipController.updateMember);
router.delete('/membership/:id', membershipController.deleteMembership);
router.post('/forgot-password', membershipController.forgotPassword);
router.post('/reset-password', membershipController.resetPassword);

module.exports = router;
