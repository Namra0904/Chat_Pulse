import express from "express";
import connectDb from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import userRoutes from "./routes/UserRoutes.js";
import { errorHandlers } from "./middleware/errorMiddleware.js";
import chatRoutes from "./routes/ChatRoutes.js";
import messageRoutes from "./routes/MessageRoutes.js";
import { Server } from "socket.io"; // Import Server from socket.io

const app = express();

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use(errorHandlers);

connectDb(process.env.URL);

// Start the server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// Initialize socket.io with the server
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

let onlineUsers = [];

io.on("connection", (socket) => {

  socket.on("setup", (userData) => {
    if (!userData || !userData._id) {
      return console.log("Invalid user data provided for setup.");
    }
    socket.join(userData._id);
    socket.emit("connected");
    console.log("User setup completed for:", userData._id);
  });

  socket.on("join chat", (room) => {
    if (!room) {
      return console.log("Room ID is not provided.");
    }
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("typing", (room) => {
    if (!room) {
      return console.log("Room ID is not provided for typing event.");
    }
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    if (!room) {
      return console.log("Room ID is not provided for stop typing event.");
    }
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageReceived) => {
    if (!newMessageReceived || !newMessageReceived.chat) {
      return console.log("Invalid message received.");
    }

    const chat = newMessageReceived.chat;
    if (!chat.users || !Array.isArray(chat.users)) {
      return console.log("chat.users is not defined or not an array.");
    }

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return; // Skip sender
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on("online-user", (newUserId) => {
    if (!newUserId) {
      return console.log("User ID is not provided.");
    }

    if (!onlineUsers.some((user) => user.userId === newUserId)) {
      onlineUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("New user online:", onlineUsers);
    }

    io.emit("get-users", onlineUsers);
  });

  socket.on("offline", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    console.log("User went offline:", onlineUsers);

    io.emit("get-users", onlineUsers);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("get-users", onlineUsers);
  });
});