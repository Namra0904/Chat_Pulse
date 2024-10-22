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


io.on("connection", (socket) => {

  socket.on('setup', (userData) => {
    socket.join(userData._id)
    socket.emit("connected")
  })

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log("User Room "+room)
  })

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat
    if (!chat.users) {
      return console.log("chat.users is not defined")
    }

    chat.users.forEach(user => {
      if (user.id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved",newMessageRecieved)
   })

  })

  // socket.on("disconnect", () => {
  //   console.log("A user disconnected");
  // });
});