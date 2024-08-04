import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";

import wallfeedRoute from "./routes/wall-feed.route.js";
import chatRouter from "./routes/chat.route.js";
import messageRouter from "./routes/message.router.js"

import notiRoute from "./routes/notification.route.js";

dotenv.config({});

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOption = {
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};
app.use(cors(corsOption));

const PORT = process.env.PORT || 3000;

app.use("/api/user", userRoute);
app.use("/api/post", postRoute);

app.use("/api", wallfeedRoute);
app.use("/api",chatRouter);
app.use("/api/messahe",messageRouter)

app.use("/api/notification", notiRoute);


app.listen(PORT, () => {
  connectDB();
  console.log(`server is running on port ${PORT}`);
});
