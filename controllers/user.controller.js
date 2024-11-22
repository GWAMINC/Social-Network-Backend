import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Wall } from "../models/wall.model.js";
import { Feed } from "../models/feed.model.js";

import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import { upload1Image } from "./media.controller.js";
import fs from "fs/promises";
export const register = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, role } = req.body;
    if (!name || !email || !password || !phoneNumber || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
      phoneNumber,
      role,
    });
    await Wall.create({
      owner: newUser._id,
    });
    await Feed.create({
      owner: newUser._id,
    });
    return res.status(201).json({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "incorrect email",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "incorrect password",
        success: false,
      });
    }
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account does not exist with current role",
        success: false,
      });
    }
    
    const tokenData = {
      userId: user._id,
    };
    const tokenExpiresIn = "1d";
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: tokenExpiresIn,
    });

    user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.name}`,
        user,
        success: true,
        token: user._id,
        tokenExpiresIn,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logout successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      avatar: user.profile.profilePhoto,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getProfileById = async (req, res) => {
  try {
    const {userId} = req.body;
    const user = await User.findById(userId)
      .populate("isFriend")
      .populate("isFollowed")
      .populate("following");

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ user, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllusers = async (req, res) => {
  const userId = req.id;
  try {
    const currentUser = await User.findById(userId).populate("isFriend");

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const friendIds = currentUser.isFriend.map((friend) => friend._id);

    const users = await User.find({
      $and: [
        { _id: { $ne: userId } }, // Not the current user
        { _id: { $nin: friendIds } }, // Not in the friendIds list
      ],
    }).select("name profile.profilePhoto");

    return res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsersByName = async (req, res) => {
  try {
    const { name } = req.params;
    const users = await User.find(
      { name: new RegExp(name, 'i') },
      "_id name profile.profilePhoto"
    );
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { personalWebsite, relationship, city, address, education, job } = req.body;

    const userId = req.id; // Middleware authentication
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false,
      });
    }

    user.profile.PersonalWebsite = personalWebsite || user.profile.PersonalWebsite; 
    user.profile.relationship = relationship || user.profile.relationship;
    user.profile.city = city; 
    user.profile.address = address;
    user.profile.education = education || user.profile.education;
    user.profile.job = job || user.profile.job;

    await user.save();
    return res.status(200).json({
      message: "User updated successfully.",
      user,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while updating the profile.",
      success: false,
    });
  }
};


export const changeAvatar = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "Không tìm thấy người dùng",
        success: false,
      });
    }

    if (req.file) {
      // Gọi hàm uploadImage để xử lý upload ảnh và nhận đường dẫn đã upload
      const uploadedImage = await upload1Image(req.file.path);

      // Lưu đường dẫn ảnh vào trường profilePhoto của user
      user.profile.profilePhoto = uploadedImage;

      // Xóa file tạm sau khi đã lưu vào cơ sở dữ liệu
      await fs.unlink(req.file.path);

      // Lưu lại thông tin người dùng đã cập nhật
      await user.save();

      // Trả về thông tin người dùng đã cập nhật
      return res.status(200).json(user);
    }

    return res.status(400).json({
      message: "Không tìm thấy file ảnh để upload",
      success: false,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Lỗi máy chủ nội bộ",
      success: false,
    });
  }
}; 

export const getProfile = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId)
      .populate("isFriend")
      .populate("isFollowed")
      .populate("following");

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ user, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const followUser = async (req, res) => {
  try {
    const userId = req.id;
    const { followedId } = req.body;

    const user = await User.findById(userId);
    const followedUser = await User.findById(followedId);
    if (!user || !followedUser) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }
    if (user.following.includes(followedId)) {
      return res.status(400).json({
        message: "This user already followed",
        success: false,
      });
    }

    user.following.push(followedId);
    followedUser.isFollowed.push(userId);

    await user.save();
    await followedUser.save();

    return res.status(200).json({
      message: "Follow " + followedUser.name + " successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const userId = req.id;
    const { unfollowedId } = req.body;

    const user = await User.findById(userId);
    const unfollowedUser = await User.findById(unfollowedId);
    if (!user || !unfollowedUser || userId === unfollowedId) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }
    if (!user.following.includes(unfollowedId)) {
      return res.status(400).json({
        message: "This user already unfollowed",
        success: false,
      });
    }
    user.following.pull(unfollowedId);
    unfollowedUser.isFollowed.pull(userId);

    await user.save();
    await unfollowedUser.save();

    return res.status(200).json({
      message: "Unfollow " + unfollowedUser.name + " successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const addFriend = async (req, res) => {
  const userId = req.id;
  const { friendId } = req.body;

  if (!friendId) {
    return res.status(400).json({ message: "ID bạn bè không hợp lệ" });
  }
  try {
    const [user, friend, userFeed, friendFeed, userWall, friendWall] =
      await Promise.all([
        User.findById(userId).exec(),
        User.findById(friendId).exec(),
        Feed.findOne({ owner: userId }).exec(),
        Feed.findOne({ owner: friendId }).exec(),
        Wall.findOne({ owner: userId }).exec(),
        Wall.findOne({ owner: friendId }).exec(),
      ]);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }
    if (!friend) {
      return res.status(404).json({ message: "Bạn bè không tồn tại." });
    }

    if (user.isFriend.includes(friendId)) {
      return res
        .status(400)
        .json({ message: "Bạn đã là bạn bè với người dùng này." });
    }
    if (userId === friendId) {
      return res
        .status(400)
        .json({ message: "Không thể thêm chính mình làm bạn." });
    }

    user.isFriend.push(friendId);
    await user.save();
    friend.isFriend.push(userId);
    await friend.save();
    userFeed.posts = userFeed.posts.concat(friendWall.posts);
    await userFeed.save();
    friendFeed.posts = friendFeed.posts.concat(userWall.posts);
    await friendFeed.save();

    res.status(200).json({ message: "Thêm bạn thành công." });
  } catch (error) {
    console.error("Lỗi khi thêm bạn:", error);
    return res.status(500).json({ message: "Lỗi máy chủ khi thêm bạn." });
  }
};

export const deleteFriend = async (req, res) => {
  const userId = req.id;
  const { unFriendId } = req.body;
  try {
    const [user, unFriend, userFeed, unFriendFeed, userWall, unFriendWall] =
      await Promise.all([
        User.findById(userId).exec(),
        User.findById(unFriendId).exec(),
        Feed.findOne({ owner: userId }).exec(),
        Feed.findOne({ owner: unFriendId }).exec(),
        Wall.findOne({ owner: userId }).exec(),
        Wall.findOne({ owner: unFriendId }).exec(),
      ]);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!unFriend) {
      return res.status(404).json({ message: "unFriend not found" });
    }
    if (!user.isFriend.includes(unFriendId)) {
      return res
        .status(404)
        .json({ message: "You and " + unFriend.name + " not friends yet" });
    }
    user.isFriend.pull(unFriendId);
    await user.save();
    unFriend.isFriend.pull(userId);
    await unFriend.save();
    userFeed.posts = userFeed.posts.filter(
      (postId) => !unFriendWall.posts.includes(postId)
    );
    await userFeed.save();
    unFriendFeed.posts = unFriendFeed.posts.filter(
      (postId) => !userWall.posts.includes(postId)
    );
    await unFriendFeed.save();

    return res.status(200).json({ message: "UnFriend successully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getFriends = async (req, res) => {
  const userId = req.id;
  try {
    const user = await User.findById(userId).populate({
      path: "isFriend",
      select: "name email",
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const friends = user.isFriend.map((friend) => ({
      _id: friend._id,
      name: friend.name,
      email: friend.email,
    }));
    res.status(200).json(friends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



export const getUserByPostId = async (postId) => {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return null;
    }
    const user = await User.findById(post.userId);
    return user;
  } catch (error) {
    console.log(error);
  }
};

export const getUserByCommentId = async (commentId) => {
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return null;
    }
    const user = await User.findById(comment.userId);
    return user;
  } catch (error) {
    console.log(error);
  }
};
