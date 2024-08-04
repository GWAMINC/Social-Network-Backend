import express from "express";
import {createPost, updatePost, deletePost} from "../controllers/post.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/createPost").post(isAuthenticated,createPost);
router.route("/updatePost").post(isAuthenticated,updatePost);
router.route("/deletePost").post(isAuthenticated,deletePost);

export default router;