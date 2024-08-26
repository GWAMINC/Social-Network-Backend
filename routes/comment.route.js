import express from "express";
import {createComment, updateComment, deleteComment, getAllComment} from "../controllers/comment.controller.js";

const router = express.Router();

router.route("/createComment").post(createComment);
router.route("/updateComment").post(updateComment);
router.route("/deleteComment").post(deleteComment);
router.route("/getAllComment/:id").get(getAllComment);
export default router;
