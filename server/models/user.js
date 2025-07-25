const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    profileImage: {
        type: String
    },
},
    {
        timestamps: true,
        collection: 'Users'
    })

module.exports = mongoose.model("User", userSchema, 'Users');