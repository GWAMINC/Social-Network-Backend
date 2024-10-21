import { Group } from "../models/group.model.js";
import { User } from "../models/user.model.js";
import { uploadImage } from "./media.controller.js";
import fs from "fs/promises";
import { getUserByPostId } from "./user.controller.js";

export const createGroup = async (req, res) => {
  const userId = req.id;
  try {
    const { name, bio, privacy } = req.body;
    let profilePhoto = [];
    console.log(name, bio, privacy, profilePhoto);

    // Kiểm tra xem req.files có tồn tại và là mảng không
    if (req.files && Array.isArray(req.files)) {
      try {
        profilePhoto = req.files.map((file) => file.path);
      } catch (error) {
        console.log(error);
      }
    }

    const uploadedImages = await uploadImage(profilePhoto);

    if (!name || !privacy) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const admin = await User.findById(userId);
    if (!admin) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    const existedName = await Group.findOne({ name });
    if (existedName) {
      return res.status(400).json({
        message: "Name already exists",
        success: false,
      });
    }

    const group = new Group({
      name: name,
      profile: { bio, profilePhoto: uploadedImages },
      privacy: privacy,
      admin: [userId],
      members: [userId],
    });

    await group.save();
    for (const image of profilePhoto) {
      try {
        await fs.unlink(image);
      } catch (error) {
        console.log(error);
      }
    }
    res.status(201).json({
      message: "Group created successfully",
      group,
      success: true,
    });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const getGroup = async (req, res) => {
  try {
    const group = await Group.find();
    res.status(200).json(group);
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const getGroupById = async (req, res) => {
  try {
    const { groupId } = req.body; // Lấy groupId từ request body

    // Tìm nhóm theo groupId và populate admin, members, posts
    const group = await Group.findById(groupId)
      .populate({ path: "admin" })
      .populate({ path: "members" })
      .populate({
        path: "posts",
        // Bạn có thể populate thêm thông tin của người đăng bài nếu cần
        // populate: {
        //   path: "userId",
        //   model: "User",
        //   select: "name profile",
        // },
      });

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
        success: false,
      });
    }

    let data = [];
    // Nếu có bài đăng (posts) trong nhóm
    if (group.posts && group.posts.length > 0) {
      for (const post of group.posts) {
        const likeCount = post.isLiked.length;
        const dislikeCount = post.isDisliked.length;
        const owner = await getUserByPostId(post._id);
        data.push({
          postInfo: {
            ...post.toObject(),
          },
          likeCount,
          dislikeCount,
          userInfo: owner, // Thông tin người đăng
          user: req.id, // ID của người dùng hiện tại
        });
      }
    }
    res.status(200).json({ group, data });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getGroupByPostId = async (req, res) => {
  try {
    const { postId } = req.params;
    const group = await Group.findOne({ posts: postId });
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGroupsByName = async (req, res) => {
  try {
    const { name } = req.params;
    const groups = await Group.find(
      { name: new RegExp(name, "i") },
      "_id name profile.profilePhoto"
    );
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGroupByUser = async (req, res) => {
  const userId = req.id;
  try {
    const groups = await Group.find({ members: userId });
    res.json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

export const updateGroup = async (req, res) => {
  const userId=req.id;
  const { groupId, name, bio, privacy } = req.body; 
  let profilePhoto = [];

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res
        .status(404)
        .json({ message: "Group not found", success: false });
    }
    if(!group.admin.includes(userId)){
      return res.status(403).json({message:"you is not admin"});
  }
    if (!name || !privacy) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    if (req.files && Array.isArray(req.files)) {
      try {
        profilePhoto = req.files.map((file) => file.path);
      } catch (error) {
        console.log(error);
      }
    }

    if (name !== group.name) {
      const existedName = await Group.findOne({ name });
      if (existedName) {
        return res.status(400).json({
          message: "Name already exists",
          success: false,
        });
      }
    }
    group.name = name;

    if (bio) group.profile.bio = bio;
    if (profilePhoto.length > 0) {
      const uploadedImages = await uploadImage(profilePhoto);
      group.profile.profilePhoto = uploadedImages;
      for (const image of profilePhoto) {
        try {
          await fs.unlink(image);
        } catch (error) {
          console.log(error);
        }
      }
    }
    if (privacy) group.privacy = privacy;
    group.updatedAt = Date.now();
    await group.save();
    res
      .status(200)
      .json({ message: "Group updated successfully", group, success: true });
  } catch (error) {
    console.error("Error updating group:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.body;

    const group = await Group.findById(groupId);

    if (!groupId) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    await group.deleteOne();

    res.status(200).json({
      message: "Group deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log("khum bic bug gi" + "\n" + error);
  }
};

export const joinGroup = async (req, res) => {
  const userId = req.id;
  const { groupId } = req.body;

  try {
    // Check if the group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        message: "Group not found",
        success: false,
      });
    }

    if (group.members.includes(userId)) {
      return res.status(400).json({
        message: "You are already a member of this group",
        success: false,
      });
    }

    group.members.push(userId);
    await group.save();

    res.status(200).json({
      message: "Successfully joined the group",
      group,
      success: true,
    });
  } catch (error) {
    console.error("Error joining group:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const removeMember = async (req, res) => {
  const { groupId, memberId } = req.body;
  const userId = req.id;
  console.log(groupId);
  console.log(memberId);

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Nhóm không tồn tại" });
    }
    if (memberId === userId) {
      return res
        .status(400)
        .json({ message: "Không thể xóa chính mình. Vui lòng cịn rời nhóm" });
    }
    if (group.admin.includes(memberId)) {
      return res.status(400).json({ message: "Thành viên là admin nhóm" });
    }
    if (!group.members.includes(memberId)) {
      return res
        .status(400)
        .json({ message: "Thành viên không có trong nhóm" });
    }

    group.members.pull(memberId);
    await group.save();

    res.status(200).json({ message: "Đã xóa thành viên thành công", group });
  } catch (error) {
    console.error("Lỗi khi xóa thành viên:", error);
    res.status(500).json({ message: "Lỗi nội bộ", success: false });
  }
};

export const addAdmin = async (req, res) => {
  const { groupId, memberId } = req.body;
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res
        .status(404)
        .json({ message: "Group not found", success: false });
    }
    if (group.admin.includes(memberId)) {
      return res
        .status(400)
        .json({ message: "This member is already an admin", success: false });
    }
    if (!group.members.includes(memberId)) {
      return res.status(400).json({
        message: "This member is not a part of the group",
        success: false,
      });
    }
    group.admin.push(memberId);
    await group.save();
    res
      .status(200)
      .json({ message: "Admin added successfully", group, success: true });
  } catch (error) {
    console.error("Error adding admin:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const leaveGroup = async (req, res) => {
  const userId = req.id;
  const { groupId } = req.body;
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res
        .status(404)
        .json({ message: "Group not found", success: false });
    }

    if (!group.members.includes(userId)) {
      return res.status(400).json({
        message: "You are not a member of this group",
        success: false,
      });
    }

    if (group.admin.includes(userId)) {
      if (group.admin.length === 1) {
        return res.status(400).json({
          message: "You must assign another member as admin before leaving",
          success: false,
        });
      }
      group.admin.pull(userId);
    }
    group.members.pull(userId);
    await group.save();

    res
      .status(200)
      .json({ message: "Successfully left the group", success: true });
  } catch (error) {
    console.error("Error leaving group:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
