const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const feedController = require('../controllers/feedController');

router.get('/', feedController.getFeed);
router.post('/', upload.single('img'), feedController.createFeed);

module.exports = router;