const express = require('express');
const router = express.Router();
const publishController = require('../controllers/publishController');

router.post('/publish', publishController.createPublish);
router.get('/cms', publishController.getAllCmsPublishes);
router.get('/publish', publishController.getAllPublishes);
router.get('/publish/:id', publishController.getPublishById);
router.put('/publish/:id', publishController.updatePublish);
router.delete('/publish/:id', publishController.deletePublish);

module.exports = router;