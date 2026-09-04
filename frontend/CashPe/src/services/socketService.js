import { io } from "socket.io-client";
import { addNotification } from "../slice/notificationSlice";
import store from "../store";

let socket;

export const initSocket = (userId) => {
  // Disconnect any existing socket
  if (socket) {
    socket.disconnect();
  }

  // Get the token from the Redux store
  const token = store.getState().auth.token;

  const API_URL = import.meta.env.VITE_API_URL || window.location.origin;

  socket = io(API_URL, {
    auth: {
      token,
    },
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    if (userId) {
      socket.emit("register", userId);
    }
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err);
  });

  socket.on("new_notification", (notification) => {
    console.log("New notification received:", notification);
    store.dispatch(addNotification(notification));
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  return socket;
};

export const getSocket = () => socket;
