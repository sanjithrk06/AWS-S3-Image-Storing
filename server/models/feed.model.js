const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        desc: {
            type: String,
            required: true
        },
        imgName: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("feed", feedSchema);