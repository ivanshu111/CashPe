const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const Redis = require("ioredis"); // Use ioredis

let io;

const initSocketManager = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  // Configure Redis adapter
  const redisOpts = {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  };
  const redisUri = process.env.REDIS_URI;
  const pubClient = redisUri
    ? new Redis(redisUri, redisOpts)
    : new Redis(redisOpts);
  const subClient = redisUri
    ? new Redis(redisUri, redisOpts)
    : new Redis(redisOpts);

  pubClient.on("error", (err) => console.error("Redis pub error:", err));
  subClient.on("error", (err) => console.error("Redis sub error:", err));

  io.adapter(createAdapter(pubClient, subClient));

  io.on("connection", (socket) => {
    console.log("a user connected:", socket.id);

    socket.on("register", (userId) => {
      if (userId) {
        console.log(`registering user ${userId} with socket ${socket.id}`);
        socket.join(userId);
      }
    });

    socket.on("disconnect", () => {
      console.log("user disconnected:", socket.id);
    });
  });
  console.log("Socket.io initialized");
  return io;
};

const emitNotificationToUser = (userId, notification) => {
  if (io && userId) {
    io.to(userId).emit("new_notification", notification);
  }
};

module.exports = {
  initSocketManager,
  emitNotificationToUser,
};