const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

router.post('/news', newsController.createItem);
router.get('/cms', newsController.getAllCmsItems);
router.get('/news', newsController.getAllItems);
router.get('/news/:id', newsController.getItemById);
router.put('/news/:id', newsController.updateItem);
router.delete('/news/:id', newsController.deleteItem);

module.exports = router;