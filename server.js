import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import commentRoute from "./routes/comment.route.js";
import wallfeedRoute from "./routes/wall-feed.route.js";
import chatRouter from "./routes/chat.route.js";
import messageRouter from "./routes/message.router.js";
import notiRoute from "./routes/notification.route.js";
import GroupRoute from "./routes/group.route.js";
import bookmarkRoute from "./routes/bookmark.route.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/comment", commentRoute);
app.use("/api", wallfeedRoute);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api/notification", notiRoute);
app.use("/api/group", GroupRoute);
app.use("/api/bookmark",bookmarkRoute);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});
