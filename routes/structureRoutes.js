const express = require('express');
const router = express.Router();
const structureController = require('../controllers/structureController');

router.post('/structure', structureController.createItem);
router.get('/cms', structureController.getAllCmsItems);
router.get('/structure', structureController.getAllItems);
router.get('/structure/:id', structureController.getItemById);
router.put('/structure/:id', structureController.updateItem);
router.delete('/structure/:id', structureController.deleteItem);

module.exports = router;