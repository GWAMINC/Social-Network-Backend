import express from "express";
import {createNotification, getNotificationById,getNotificationByUser, deleteNotification} from "../controllers/notification.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/createNoti").post(isAuthenticated,createNotification);
router.route("/getNoti").get(isAuthenticated,getNotificationById);
router.route("/deleteNoti").post(isAuthenticated,deleteNotification);
router.route("/getNotificationByUser").get(isAuthenticated,getNotificationByUser)

export default router;