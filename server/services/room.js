const roomModel = require('../models/room');
const { Redis } = require('ioredis');
const redisClient = new Redis();

redisClient.on('ready', () => {
    console.log('✅ Redis Connected successfully');
});

redisClient.on('error', (err) => {
    console.error('Redis Error:', err);
});


const isUserInRoom = async (roomId, userEmail) => {
    if (!roomId) return { isAllowed: false, err: 'roomId is required' };

    const room = await roomModel.findById(roomId);
    if (!room || !room.users.includes(userEmail)) {
        return { isAllowed: false, err: 'Room does not exist or user not allowed' };
    }

    return { isAllowed: true };
};

const addSocket = async (socketId, user, roomId) => {
    try {
        await redisClient.set(`socket:${socketId}`, JSON.stringify({ userId: user._id, name: user.name, roomId }));
        await redisClient.hset(`room:${roomId}:users`, user._id, JSON.stringify(user));
    } catch (error) {
        console.log(error);
    }
};

const removeSocket = async (socketId) => {
    try {
        let data = await redisClient.get(`socket:${socketId}`);
        if (!data) return {};
        data = JSON.parse(data);
        const { userId, roomId } = data
        await redisClient.del(`socket:${socketId}`);
        await redisClient.hdel(`room:${roomId}:users`, userId)
        return data;
    } catch (error) {
        console.log(error);
        return {};
    }
};

const updateCode = async (roomId, code) => {
    try {
        await redisClient.set(`room:${roomId}:code`, code);
    } catch (error) {
        console.log(error);
    }
}

const updateLanguage = async (roomId, language) => {
    try {
        await redisClient.set(`room:${roomId}:language`, language);
    } catch (error) {
        console.log(error);
    }
}

const fetchRoomDetails = async (roomId) => {
    try {
        const language = await redisClient.get(`room:${roomId}:language`);
        const code = await redisClient.get(`room:${roomId}:code`);
        const userStrings = await redisClient.hvals(`room:${roomId}:users`);
        const users = userStrings.map(str => JSON.parse(str)).filter(obj => Object.keys(obj).length > 0);
        return { users, language, code, error: null }
    } catch (error) {
        return { error }
    }
}

module.exports = {
    isUserInRoom,
    addSocket,
    removeSocket,
    updateCode,
    updateLanguage,
    fetchRoomDetails,
};