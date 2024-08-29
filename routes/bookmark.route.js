import express from "express";
import { addBookmark, deleteBookmark, getBookmarks } from "../controllers/bookmark.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/addBookmark").post(isAuthenticated,addBookmark);
router.route("/deleteBookmark").post(isAuthenticated,deleteBookmark);
router.route("/getBookmarks").get(isAuthenticated,getBookmarks);

export default router;