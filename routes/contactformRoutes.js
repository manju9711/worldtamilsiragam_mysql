const express = require('express');
const router = express.Router();
const contactformController = require('../controllers/contactformController');

router.post('/contacts', contactformController.createContactForm);
router.get('/contacts', contactformController.getContactForms);
router.put('/contacts/:id', contactformController.updateContactForm);

module.exports = router;

