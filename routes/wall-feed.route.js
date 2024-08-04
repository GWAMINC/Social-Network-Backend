import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getFeed, getWall } from "../controllers/wall-feed.controller.js";

const router = express.Router();

router.route("/getfeed").get(isAuthenticated,getFeed);
router.route("/getwall").get(isAuthenticated,getWall);

export default router;