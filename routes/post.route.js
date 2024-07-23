import express from "express";
import {createPost} from "../controllers/post.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/createPost").post( createPost);

export default router;