require('dotenv').config();
const mongoose = require('mongoose');
const MONGODB_URI = require('../config/db');
// mongoose.set('debug', true);


let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('⏩ Already connected to MongoDB');
        return;
    }
    try {
        console.log('✚ New Connection...');
        await mongoose.connect(MONGODB_URI, {
            dbName: process.env.MONGO_DB_NAME,
            maxPoolSize: 2,
            socketTimeoutMS: 10000,
        });
    } catch (err) {
        console.error('⛔ Error connecting to MongoDB', err);
    }
};



mongoose.connection.on('connected', () => {
    isConnected = true;
    console.log('✅ Mongoose connected to DB 🔗');
});

mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  Mongoose disconnected. Attempting to reconnect...');
    isConnected = false;
});


mongoose.connection.on('reconnected', () => {
    console.log('⌛ Mongoose Reconnected to DB 🔗');
});

mongoose.connection.on('error', (err) => {
    console.error('⛔ Mongoose connection error:', err);
    isConnected = false;
});

module.exports = connectDB;