const { isUserInRoom } = require('../services/room');

const isAuthenticated = (req, res, next) => {
    try {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.status(401).send({ message: "Unauthorized!" });
    } catch (error) {
        return res.status(500).send({ message: error?.message || "INTERNAL SERVER ERROR" });
    }
}


const canAccessRoom = async (req, res, next) => {
    const { roomId } = req.params;
    const { email } = req.user;
    const { isAllowed, err } = await isUserInRoom(roomId, email);
    if (!isAllowed) {
        return res.status(400).send({ message: err });
    }
    next();
}

module.exports = {
    isAuthenticated,
    canAccessRoom,
};