import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import crypto from 'crypto';
import sharp from 'sharp';
import Feed from '../models/feed.model.js'; // Updated to ESM
import dotenv from 'dotenv';

dotenv.config();

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

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

    for (const feed of feeds) {
      const getObjectParams = {
        Bucket: bucketName,
        Key: feed.imgName
      };
      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      feed.imgName = url;
    }

    return res.status(200).json({ feeds });
  } catch (error) {
    console.error('Error fetching feeds:', error.message);
    return res.status(500).json({ message: 'Server error, could not fetch feeds' });
  }
};


export const deleteFeed = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the feed by ID
    const feed = await Feed.findById(id);
    if (!feed) {
      return res.status(404).json({ message: 'Feed not found' });
    }

    // Delete the image from S3
    const params = {
      Bucket: bucketName,
      Key: feed.imgName,
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    // Delete the feed from MongoDB
    await Feed.findByIdAndDelete(id);

    return res.status(200).json({ message: 'Feed and associated image deleted successfully' });
  } catch (error) {
    console.error('Error deleting feed:', error.message);
    return res.status(500).json({ message: 'Server error, could not delete feed' });
  }
};