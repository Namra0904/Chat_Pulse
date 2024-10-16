import express from 'express'
import connectDb from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors"; 
import userRoutes from "./routes/UserRoutes.js"
import { notFound, errorHandlers } from './middleware/errorMiddleware.js';
import chatRoutes from "./routes/ChatRoutes.js"

const app = express()
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend origin
  })
);

app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/chat",chatRoutes)
app.use(notFound)
app.use(errorHandlers)
connectDb(process.env.URL)


app.listen(process.env.PORT, () => {
    console.log("server is running at 5000")
})