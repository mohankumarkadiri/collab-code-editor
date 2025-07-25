const { Redis } = require("ioredis");

const redis = new Redis();

redis.on("connect", () => console.log("✅ Connected to Redis"));
redis.on("error", (err) => console.log("⛔ Redis Error :", err))

module.exports = redis