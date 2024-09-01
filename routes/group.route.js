import express from "express";
import{createGroup,updateGroup,deleteGroup, getGroup, getGroupByUser, getGroupById} from "../controllers/group.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { checkAdminGroup } from "../middlewares/checkAdminGroup.js";
import { upload } from "../utils/cloudinary.js";

const router = express.Router();
router.route("/createGroup").post(isAuthenticated,upload.array('profilePhoto'),createGroup);
router.route("/getGroup").get(isAuthenticated,getGroup);
router.route("/getGroupByUser").get(isAuthenticated,getGroupByUser);
router.route("/updateGroup").post(isAuthenticated,checkAdminGroup,updateGroup);
router.route("/deleteGroup").post(isAuthenticated,checkAdminGroup,deleteGroup);
router.route("/getGroupById").post(isAuthenticated,getGroupById);
export default router;