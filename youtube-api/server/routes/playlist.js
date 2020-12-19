const express = require('express');
const router = express.Router();

const { playlist } = require("./../controllers/playlist");

router.post('/playlist', playlist);

module.exports = router;