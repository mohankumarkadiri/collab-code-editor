const { USER_LEFT } = require("../../../shared/constants").default;
const { removeSocket } = require('../../services/room');

const handleLeaveRoom = (_, socket) => {
    socket.secureOn('disconnect', async () => {
        try {
            const { userId, roomId, name } = await removeSocket(socket.id);
            socket.to(roomId).emit(USER_LEFT, { _id: userId, name });
        } catch (error) {
            console.log(error);
        }
    });
};

module.exports = { handleLeaveRoom };