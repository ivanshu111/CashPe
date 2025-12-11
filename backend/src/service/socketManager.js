const { Server } = require("socket.io");

let io;

const initSocketManager = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

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
