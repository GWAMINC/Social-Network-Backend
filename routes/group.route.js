import express from "express";
import{createGroup,updateGroup,deleteGroup, getGroup, getGroupByUser, getGroupById, getGroupsByName, getGroupByPostId, joinGroup, removeMember, addAdmin, leaveGroup} from "../controllers/group.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { checkAdminGroup } from "../middlewares/checkAdminGroup.js";
import { upload } from "../utils/cloudinary.js";

const router = express.Router();
router.route("/createGroup").post(isAuthenticated,upload.array('profilePhoto'),createGroup);
router.route("/getGroup").get(isAuthenticated,getGroup);
router.route("/getGroupByUser").get(isAuthenticated,getGroupByUser);
router.route("/updateGroup").post(isAuthenticated,upload.array('profilePhoto'),updateGroup);
router.route("/deleteGroup").post(isAuthenticated,checkAdminGroup,deleteGroup);
router.route("/getGroupById").post(isAuthenticated,getGroupById);
router.route("/getGroupByPostId/:postId").get(isAuthenticated, getGroupByPostId);
router.route("/getGroupsByName/:name").get(isAuthenticated, getGroupsByName);
router.route("/joinGroup").post(isAuthenticated,joinGroup)
router.route("/removeMember").post(isAuthenticated,checkAdminGroup, removeMember);
router.route("/addAdmin").post(isAuthenticated,checkAdminGroup,addAdmin)
router.route("/leaveGroup").post(isAuthenticated,leaveGroup)
export default router; 