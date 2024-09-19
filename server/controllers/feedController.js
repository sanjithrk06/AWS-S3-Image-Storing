const Feed = require('../models/feed.model');

const createFeed = async (req, res) => {
    try {
        const { name, desc } = req.body;
        const imgName = req.file.originalname;

        if (!name || !desc || !imgName) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newFeed = new Feed({
            name,
            desc,
            imgName,
        });

        console.log(req.file);

        const savedFeed = await newFeed.save();

        return res.status(201).json({ message: "Feed created successfully", feed: savedFeed });
    } catch (error) {
        console.error("Error creating feed:", error.message);
        return res.status(500).json({ message: "Server error, could not create feed" });
    }
};

const getFeed = async (req, res) => {
    try {
        const feeds = await Feed.find();

        if (!feeds.length) {
            return res.status(404).json({ message: "No feeds found" });
        }

        return res.status(200).json({ feeds });
    } catch (error) {
        console.error("Error fetching feeds:", error.message);
        return res.status(500).json({ message: "Server error, could not fetch feeds" });
    }
};

module.exports = {
    createFeed,
    getFeed
};
