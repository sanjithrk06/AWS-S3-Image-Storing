require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const mongoose = require('mongoose');

const connectDb = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to the DB");
    } catch (error) {
        console.error(`ERROR : ${error.message}`);
        process.exit(1);
    }
}

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res)=> {
    return res.status(200).send("Welcome to the Image Upload Server");
})

const feedRouter = require('./routes/feed.route');
app.use('/feed', feedRouter);

app.listen(process.env.PORT, async()=> {
    await connectDb();
    console.log("App is listening on the port :", process.env.PORT || 4001);
})