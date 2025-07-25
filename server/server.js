const http = require("http");
const app = require("./app");
const { setupSocket } = require("./sockets");
const { SERVER_PORT } = require('../shared/constants').default;


const server = http.createServer(app);

setupSocket(server);

server.listen(SERVER_PORT, () => {
    console.log(`✅ Server is running on port ${SERVER_PORT}`);
});