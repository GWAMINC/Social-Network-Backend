import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js"
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
dotenv.config({});

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
const corsOption = {
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials:true
}
app.use(cors(corsOption));


const PORT = process.env.PORT || 3000;

app.use("/api/user", userRoute);
app.use("/api/post", postRoute);

app.listen(PORT, () => {
    connectDB();
    console.log(`server is running on port ${PORT}`);
})




