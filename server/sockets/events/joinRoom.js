const { JOIN_ROOM, NEW_USER_JOINED } = require("../../../shared/constants").default;
const { isUserInRoom, addSocket } = require("../../services/room");

const joinRoom = (_, socket) => {
    socket.secureOn(JOIN_ROOM, async ({ roomId }, ack) => {
        const user = socket.request?.user || {};
        const { isAllowed, err } = await isUserInRoom(roomId, user?.email)
        if (!isAllowed) {
            if (typeof ack === 'function') {
                return ack({ error: err });
            }
            return
        }
        socket.data.roomId = roomId;
        socket.join(roomId);
        socket.to(roomId).emit(NEW_USER_JOINED, user);
        addSocket(socket.id, user, roomId);
    });
};


module.exports = joinRoom;