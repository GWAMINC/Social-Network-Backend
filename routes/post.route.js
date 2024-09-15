import express from "express";
import {createPost, updatePost, deletePost, likePost, dislikePost, getAllPost, getPostCurrentUser} from "../controllers/post.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {upload} from "../utils/cloudinary.js";

const router = express.Router();


router.route("/createPost").post(isAuthenticated,upload.array('images'),createPost);
router.route("/updatePost").post(isAuthenticated,updatePost);
router.route("/deletePost").post(isAuthenticated,deletePost);
router.route("/likePost").post(isAuthenticated,likePost);
router.route("/dislikePost").post(isAuthenticated,dislikePost);
router.route("/getAllPost").get(isAuthenticated,getAllPost);
router.route("/getPostCurrentUser").post(isAuthenticated,getPostCurrentUser);
export default router;