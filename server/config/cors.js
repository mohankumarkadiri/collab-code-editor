const CORS_OPTIONS = {
    origin: process.env.UI_BASE_URL,
    credentials: true,
    methods: ["GET", "POST"],
};


module.exports = { CORS_OPTIONS }