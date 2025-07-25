const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    host: {
        type: String,
        required: true,
        trim: true,
    },
    users: {
        type: [String],
        required: true,
        default: [],
    },
}, { timestamps: true, collection: 'Rooms' });

module.exports = mongoose.model("Room", roomSchema, "Rooms")