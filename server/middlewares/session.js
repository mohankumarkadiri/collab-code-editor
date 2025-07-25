const session = require('express-session');
const MongoStore = require('connect-mongo');
const MONGODB_URI = require('../config/db');

const sessionMiddleware = session({
    name: "collab-editor",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGODB_URI }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    },
});

module.exports = sessionMiddleware;