const express = require('express');
const router = express.Router();
const tracksController = require('../controllers/tracksController');

router.post('/tracks', tracksController.createTrack);
router.get('/cms', tracksController.getAllCmsTracks);
router.get('/tracks', tracksController.getAllTracks);
router.get('/tracks/:id', tracksController.getTrackById);
router.put('/tracks/:id', tracksController.updateTrack);
router.delete('/tracks/:id', tracksController.deleteTrack);
router.put('/tracks/status/:id', tracksController.updateTrackStatus);


module.exports = router;