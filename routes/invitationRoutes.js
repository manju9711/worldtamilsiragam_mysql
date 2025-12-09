const express = require('express');
const router = express.Router();
const invitationController = require('../controllers/invitationController');

router.post('/invitation', invitationController.createItem);
router.get('/cms', invitationController.getAllCmsItems);
router.get('/invitation', invitationController.getAllItems);
router.get('/invitation/:id', invitationController.getItemById);
router.put('/invitation/:id', invitationController.updateItem);
router.delete('/invitation/:id', invitationController.deleteItem);

module.exports = router;