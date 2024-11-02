import express from "express";
import {
    createComment,
    updateComment,
    deleteComment,
    getAllComment, getReplies,


} from "../controllers/comment.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
const router = express.Router();

router.route("/createComment").post(isAuthenticated,createComment);
router.route("/updateComment/:id").post(updateComment);
router.route("/deleteComment/:id").post(deleteComment);
router.route("/getAllComment/:id").get(getAllComment);
router.route("/getReplies/:id").get(getReplies);

export default router;
