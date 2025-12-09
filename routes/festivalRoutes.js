const express = require('express');
const router = express.Router();
const festivalController = require('../controllers/festivalController');

router.post('/festival', festivalController.createItem);
router.get('/cms', festivalController.getAllCmsItems);
router.get('/festival', festivalController.getAllItems);
router.get('/festival/:id', festivalController.getItemById);
router.put('/festival/:id', festivalController.updateItem);
router.delete('/festival/:id', festivalController.deleteItem);

module.exports = router;