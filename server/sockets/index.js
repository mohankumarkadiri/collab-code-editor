const { Server } = require("socket.io");
const passport = require("passport");
const sessionMiddleware = require('../middlewares/session');
const joinRoom = require('./events/joinRoom');
const { handleLeaveRoom } = require("./events/leaveRoom");
const handleCursor = require("./events/cursor");
const { handleCodeChange, handleLanguageChange } = require("./events/code");
const { CORS_OPTIONS } = require("../config/cors");


const setupSocket = (server) => {

    const io = new Server(server, {
        cors: CORS_OPTIONS,
    });

    io.engine.use(sessionMiddleware);
    io.engine.use(passport.initialize());
    io.engine.use(passport.session());

    io.on("connection", (socket) => {
        console.log('[+] New connection:', socket.id);

        socket.secureOn = (event, handler, { authRequired = true } = {}) => {
            socket.on(event, (data, ack) => {
                if (authRequired && !socket.request.user) {
                    if (typeof ack === 'function') {
                        return ack({ error: 'unauthorized' });
                    }
                    return;
                }
                handler(data, ack);
            });
        };

        // register socket events
        joinRoom(io, socket);
        handleLeaveRoom(io, socket);
        handleCursor(io, socket);
        handleCodeChange(io, socket);
        handleLanguageChange(io, socket);
    });
}

module.exports = { setupSocket };