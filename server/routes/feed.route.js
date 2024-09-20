import express from 'express';
import multer from 'multer';
import { createFeed, deleteFeed, getFeed } from '../controllers/feedController.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', getFeed);
router.post('/', upload.single('img'), createFeed);
router.delete('/:id', deleteFeed);

export default router;