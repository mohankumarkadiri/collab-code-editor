const { io } = require("socket.io-client");

const SERVER_URL = "http://localhost:17291";
const ROOM_ID = "test-room";
const TOTAL_USERS = 50;
const MESSAGE_INTERVAL = 1000;

const latencyStats = [];

function getRandomText(len = 5) {
  const chars = "abcdefgxyz";
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function nowMs() {
  return performance.now ? performance.now() : new Date().getTime();
}

function startClient(userId) {
  const socket = io(SERVER_URL, {
    transports: ["websocket"],
    reconnection: false,
  });

  let pingTimes = [];

  socket.on("connect", () => {
    socket.emit("join_room", {
      roomId: ROOM_ID,
      username: `User-${userId}`,
    });

    setInterval(() => {
      const timestamp = nowMs();
      const message = `update-${getRandomText(5)}-${timestamp}`;

      socket.emit("code_changed", {
        roomId: ROOM_ID,
        code: message,
        timestamp,
        userId,
      });
    }, MESSAGE_INTERVAL);
  });

  socket.on("code_changed", (data) => {
    if (data.userId !== userId) return;

    const rtt = nowMs() - data.timestamp;
    pingTimes.push(rtt);
    if (pingTimes.length > 100) pingTimes.shift();

    latencyStats[userId] = {
      count: pingTimes.length,
      avg: (pingTimes.reduce((a, b) => a + b, 0) / pingTimes.length).toFixed(2),
      last: rtt.toFixed(2),
    };
  });

  socket.on("connect_error", (err) => {
    console.error(`User ${userId} connection error:`, err.message);
  });
}

for (let i = 0; i < TOTAL_USERS; i++) {
  setTimeout(() => startClient(i), i * 80);
}

setInterval(() => {
  console.clear();
  console.log(`Latency Report (${latencyStats.length} clients)`);
  latencyStats.forEach((stat, i) => {
    if (!stat) return;
    console.log(`User ${i}: last = ${stat.last}ms, avg = ${stat.avg}ms (${stat.count} samples)`);
  });
}, 5000);
