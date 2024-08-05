import express from "express";
import {
  createMessage,
  deleteMessage,
  getMessage,
  updateMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.route("/getMessage").get(getMessage);
router.route("/createMessage").post(createMessage);
router.route("/updateMessage").put(updateMessage);
router.route("/deleteMessage").delete(deleteMessage);

export default router;