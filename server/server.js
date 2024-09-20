import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { connect } from 'mongoose';

dotenv.config();

const connectDb = async () => {
  try {
    await connect(process.env.MONGO_URI);
    console.log('Connected to the DB');
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    process.exit(1);
  }
};

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).send('Welcome to the Image Upload Server');
});

import feedRouter from './routes/feed.route.js';
app.use('/feed', feedRouter);

const port = process.env.PORT || 4001;
app.listen(port, async () => {
  await connectDb();
  console.log('App is listening on the port:', port);
});
