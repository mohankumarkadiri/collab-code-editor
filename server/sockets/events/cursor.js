const { CURSOR_UPDATED } = require("../../../shared/constants").default;

const handleCursor = (_, socket) => {
    socket.secureOn(CURSOR_UPDATED, ({ userId, position }) => {
        socket.to(socket.data.roomId).emit(CURSOR_UPDATED, { userId, position });
    })
}

module.exports = handleCursor;