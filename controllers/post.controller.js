import { Feed } from "../models/feed.model.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Wall } from "../models/wall.model.js";
import { Group } from "../models/group.model.js";
import { Notification } from "../models/notification.model.js";
import { deleteImage, uploadImage } from "../controllers/media.controller.js";
import { getUserByPostId } from "./user.controller.js";
import fs from "fs/promises";
export const createPost = async (req, res) => {
  try {
    const userId = req.id; // Assuming req.id is the logged-in user's ID
    const { content, access } = req.body;
    let images = [];

    // Handling file upload if images are included in the request
    if (req.files) {
      images = req.files.map((file) => file.path);
    }

    // Function to upload images (assuming it's defined elsewhere)
    const uploadedImages = await uploadImage(images);

    // Check if required fields are missing
    if (!userId || !content || !access) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    // Create a new post
    const post = new Post({
      userId: user._id,
      author: user.name,
      content: content,
      access: access,
      images: uploadedImages,
    });

    // Update the user's wall
    let wall = await Wall.findOne({ owner: user._id });
    if (!wall) {
      wall = new Wall({
        owner: user._id,
        posts: [post._id],
      });
    } else {
      wall.posts.push(post._id);
    }
    await post.save();
    await wall.save();

    // Update the user's feed
    let feed = await Feed.findOne({ owner: user._id });
    if (!feed) {
      feed = new Feed({
        owner: user._id,
        posts: [post._id],
      });
    } else {
      feed.posts.push(post._id);
    }
    await feed.save();

    // Notify user's friends about the new post
    const friends = user.isFriend; // Assuming isFriend is an array of friend IDs
    const notifications = [];
    for (const friendId of friends) {
      const notification = new Notification({
        userId: friendId,
        content: user.name + " đã đăng 1 bài viết mới: " + content,
        link: post._id,
        author: {
          avatar: user.profile.profilePhoto,
          name: user.name,
        },
      });
      notifications.push(notification);
    }
    await Notification.insertMany(notifications);

    // Delete temporary files (if any)
    for (const image of images) {
      try {
        await fs.unlink(image);
      } catch (error) {
        console.log(error);
      }
    }

    // Send success response
    res.status(200).json({
      message: "Post created successfully",
      wall,
      success: true,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const getAllPost = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);
    const feed = await Feed.findOne({ owner: userId });
    let postInfos = await Post.find({
      _id: {
        $in: feed.posts,
        $nin: user.notInterestedPosts
      },
      $or: [{ access: "public" }, { userId: userId }],
    }).select("_id");
    const groups = await Group.find({ members: userId }).lean();

    for (const group of groups) {
      for (const groupPostId of group.posts) {
        const i = postInfos.findIndex(post => post._id.equals(groupPostId));
        if (i !== -1)
          postInfos.splice(i, 1);

        postInfos.push({
          _id: groupPostId,
          group
        });
      }
    }
    if (!postInfos || !feed) {
      return res.status(400).json({
        message: "Post or Feed not found",
        success: false,
      });
    }

    const data = [];
    for (const postInfo of postInfos) {
      const post = await Post.findById(postInfo._id);
      const owner = await getUserByPostId(postInfo._id);
      data.push({
        postInfo: post,
        userInfo: owner,
        likeCount: post.isLiked.length,
        dislikeCount: post.isDisliked.length,
        user: userId,
        group: postInfo.group
      });
    }
    data.sort((data1, data2) => {
      const time1 = Date.parse(data1.postInfo.createdAt);
      const time2 = Date.parse(data2.postInfo.createdAt);
      return time1 - time2;
    });

    return res.status(200).json({
      posts: data,
      success: true,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "An error occurred while fetching posts",
      success: false,
    });
  }
};
export const getPostById = async (req, res) => {
  try {
    const { postId } = req.body;
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(400).json({
        message: "Post not found",
        success: false,
      });
    }

    res.status(200).json({
      post,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getPostsByContent = async (req, res) => {
  try {
    const { content } = req.params;
    const posts = await Post.find(
      { content: new RegExp(content, "i") },
      "_id userId content images"
    );
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostCurrentUser = async (req, res) => {
  const {userId} = req.body;
  try {
    const posts = await Post.find({ userId: userId });
    const data = [];
    for (let post of posts) {
      const owner = await getUserByPostId(post._id);
      data.push({
        postInfo: post,
        userInfo: owner,
        likeCount: post.isLiked.length,
        dislikeCount: post.isDisliked.length,
        user: userId,
      });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const updatePost = async (req, res) => {
  try {
    const { postId, content, access } = req.body;

    if (!postId || !content || !access) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(400).json({
        message: "Post not found",
        success: false,
      });
    }

    post.content = content;
    post.access = access;
    post.updatedAt = Date.now();

    await post.save();

    res.status(200).json({
      message: "Post updated successfully",
      success: true,
    });
    console.log("Post updated successfully");
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        message: "Post not found",
        success: false,
      });
    }

    await deleteImage(post.images); // delete image from cloudinary
    await post.deleteOne(); // delete post from database
    let wall = await Wall.findOne({ owner: post.userId });
    const postIndex = wall.posts.indexOf(postId);
    if (postIndex > -1) {
      wall.posts.splice(postIndex, 1); // delete post from wall
      await wall.save();
    }
    let feed = await Feed.findOne({ owner: post.userId });
    const postIdx = feed.posts.indexOf(postId);
    if (postIdx > -1) {
      feed.posts.splice(postIdx, 1);
      await feed.save();
    }

    res.status(200).json({
      message: "Post is deleted ",
      success: true,
    });
    console.log("Post is deleted");
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (req, res) => {
  try {
    const userId = req.id;
    const { postId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        message: "Post not found",
        success: false,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }
    if (post.isLiked.includes(user._id)) {
      await post.isLiked.pull(user._id);
      await post.save();
      res.status(200).json({
        message: "Unliked post",
        success: true,
      });
    } else {
      if (post.isDisliked.includes(user._id)) {
        await post.isDisliked.pull(user._id);
      }
      await post.isLiked.push(user._id);
      await post.save();
      res.status(200).json({
        message: "Liked post",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const dislikePost = async (req, res) => {
  try {
    const userId = req.id;
    const { postId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        message: "Post not found",
        success: false,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    if (post.isDisliked.includes(user._id)) {
      await post.isDisliked.pull(user._id);
      await post.save();
      res.status(200).json({
        message: "Undisliked post",
        success: true,
      });
    } else {
      if (post.isLiked.includes(user._id)) {
        await post.isLiked.pull(user._id);
      }
      await post.isDisliked.push(user._id);
      await post.save();
      res.status(200).json({
        message: "Disliked post",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const createNotInterestedPost = async (req, res) => {
  try {
    const userId = req.id;
    const {postId} = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }
    await user.notInterestedPosts.push(postId);
    await user.save();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Cannot createNotInterestedPost" });
  }
}
