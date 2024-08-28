import express from "express";
import {
  addUser,
  createChat,
  deleteChat,
  getAllChat,
  getChat,
  leaveGroup,
  removeUser,
  updateChat,
} from "../controllers/chat.controller.js";
import { checkAdminChat } from "../middlewares/checkAdminChat.js";

const router = express.Router();
router.route("/chats/:id").get(getChat);
router.route("/all/:id").get(getAllChat);
router.route("/chats").post(createChat);
router.route("/chats/:id").put(checkAdminChat, updateChat);
router.route("/chats/:id").delete(checkAdminChat, deleteChat);
router.route("/chats/addUser").post(checkAdminChat, addUser);
router.route("/chats/removeUser").post(checkAdminChat, removeUser);
router.route("/chats/leave").delete(leaveGroup);

export default router;
