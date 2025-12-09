const express = require('express');
const router = express.Router();
const multilingualController = require('../controllers/multilingualController');

router.post('/items', multilingualController.createItem);
router.get('/items', multilingualController.getAllItems);
router.get('/items/:id', multilingualController.getItemById);
router.put('/items/:id', multilingualController.updateItem);
router.delete('/items/:id', multilingualController.deleteItem);

module.exports = router;
