import express from 'express';
import multer from 'multer';
import { createFeed, getFeed } from '../controllers/feedController.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', getFeed);
router.post('/', upload.single('img'), createFeed);

export default router;
