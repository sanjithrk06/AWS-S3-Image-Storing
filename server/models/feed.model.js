import mongoose from 'mongoose';

const { Schema } = mongoose;

const feedSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
            required: true,
        },
        imgName: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Feed = mongoose.model('Feed', feedSchema);

export default Feed;