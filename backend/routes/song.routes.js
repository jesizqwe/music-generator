const express = require('express');
const router = express.Router();
const songsController = require('../controllers/songsController');

router.get('/api/songs', songsController.getSongs);

module.exports = router;