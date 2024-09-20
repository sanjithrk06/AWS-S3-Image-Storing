import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import sharp from 'sharp';
import Feed from '../models/feed.model.js'; // Updated to ESM
import dotenv from 'dotenv';

dotenv.config();

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

console.log("Bucket Region:", bucketRegion);

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

const randomImgName = (byte = 32) => crypto.randomBytes(byte).toString('hex');

export const createFeed = async (req, res) => {
  try {
    const { name, desc } = req.body;
    const image = req.file.originalname;

    if (!name || !desc || !image) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const imgName = randomImgName();
    // Resize image
    const buffer = await sharp(req.file.buffer)
      .resize({ height: 1920, width: 1080, fit: 'contain' })
      .toBuffer();

    const params = {
      Bucket: bucketName,
      Key: imgName,
      Body: buffer,
      ContentType: req.file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    const newFeed = new Feed({
      name,
      desc,
      imgName,
    });

    const savedFeed = await newFeed.save();
    return res.status(201).json({ message: 'Feed created successfully', feed: savedFeed });
  } catch (error) {
    console.error('Error creating feed:', error.message);
    return res.status(500).json({ message: 'Server error, could not create feed' });
  }
};

export const getFeed = async (req, res) => {
  try {
    const feeds = await Feed.find();

    if (!feeds.length) {
      return res.status(404).json({ message: 'No feeds found' });
    }

    return res.status(200).json({ feeds });
  } catch (error) {
    console.error('Error fetching feeds:', error.message);
    return res.status(500).json({ message: 'Server error, could not fetch feeds' });
  }
};
