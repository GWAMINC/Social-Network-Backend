import express from "express";
import {createComment, getComments, updateComment, deleteComment} from "../controllers/comment.controller.js";

const router = express.Router();

router.route("/createComment").post(createComment);
router.route("/getComments/:postID").get(getComments);
router.route("/updateComment").post(updateComment);
router.route("/deleteComment").post(deleteComment);

export default router;
