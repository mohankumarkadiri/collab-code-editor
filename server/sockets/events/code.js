const { CODE_CHANGED, LANGUAGE_CHANGED } = require("../../../shared/constants").default;
const { updateCode, updateLanguage } = require('../../services/room');

const handleCodeChange = (_, socket) => {
    socket.secureOn(CODE_CHANGED, ({ code }) => {
        const roomId = socket.data.roomId;
        updateCode(roomId, code)
        socket.to(roomId).emit(CODE_CHANGED, { code });
    })
}

const handleLanguageChange = (_, socket) => {
    socket.secureOn(LANGUAGE_CHANGED, ({ language }) => {
        const roomId = socket.data.roomId;
        updateLanguage(roomId, language);
        socket.to(roomId).emit(LANGUAGE_CHANGED, { language });
    })
}

module.exports = { handleCodeChange, handleLanguageChange };