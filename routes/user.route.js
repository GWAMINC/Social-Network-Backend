import express from "express";
import {
  login,
  register,
  logout,
  updateProfile,
  getProfile,
  followUser,
  unfollowUser,
  addFriend,
  getFriends,
  getAllusser,
  deleteFriend,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(isAuthenticated, logout);
router.route("/getallusers").get(getAllusser);
router.route("/profile").get(isAuthenticated, getProfile);
router.route("/profile/update").post(isAuthenticated, updateProfile);
router.route("/followUser").post(isAuthenticated, followUser);
router.route("/unfollowUser").post(isAuthenticated, unfollowUser);
router.route("/addfriend").post(isAuthenticated, addFriend);
router.route("/unfriend").post(isAuthenticated, deleteFriend);
router.route("/getfriend").post(isAuthenticated, getFriends);
export default router;
