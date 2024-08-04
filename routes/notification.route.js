import express from "express";
import {createNotification, getNotificationById,getNotificationByUser, deleteNotification} from "../controllers/notification.controller.js";

const router = express.Router();

router.route("/createNoti").post(createNotification);
router.route("/getNoti").get(getNotificationById);
router.route("/deleteNoti").post(deleteNotification);

export default router;