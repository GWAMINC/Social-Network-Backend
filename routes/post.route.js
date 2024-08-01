import express from "express";
import {createPost, updatePost, deletePost} from "../controllers/post.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {upload} from "../utils/cloudinary.js";

const router = express.Router();

router.route("/createPost").post(upload.array('images'),createPost);
router.route("/updatePost").post(updatePost);
router.route("/deletePost").post(deletePost);

export default router;