import express from "express";
import{createGroup,updateGroup,deleteGroup} from "../controllers/group.controller.js";

const router = express.Router();
router.route("/createGroup").post(createGroup);
router.route("/updateGroup").post(updateGroup);
router.route("/deleteGroup").post(deleteGroup);

export default router;