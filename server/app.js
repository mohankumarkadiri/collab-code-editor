require("dotenv").config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const mongoose = require("mongoose");
const { CORS_OPTIONS } = require('./config/cors');
const router = require('./api/routes');
const sessionMiddleware = require('./middlewares/session');
const MONGODB_URI = require('./config/db');
require('./utils/passportSetup');

const app = express();


mongoose.connect(MONGODB_URI).catch((err) => console.log("⛔ " + err));


app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors(CORS_OPTIONS));


app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

app.use(router);

module.exports = app;