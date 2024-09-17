import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import {getUserByPostId} from "./user.controller.js";

export const addBookmark = async (req, res) => {
    try {
        const userId = req.id;
        const {postId} = req.body;
        const post = await Post.findById(postId);
        const user = await User.findById(userId);
        if (user.bookmarkedPosts.includes(postId)) {
            return res.status(400).json({message: "Post already bookmarked"});
        }
        post.isBookmarkedBy.push(userId);
        user.bookmarkedPosts.push(postId);
        await user.save();
        await post.save();

        res.status(200).json({message: "Post bookmarked successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const getBookmarks = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).populate('bookmarkedPosts');
        const posts = user.bookmarkedPosts;
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

export const deleteBookmark = async (req, res) => {
    try {
        const userId = req.id;
        const {postId} = req.body;

        const post = await Post.findById(postId);
        const user = await User.findById(userId);

        if (!user.bookmarkedPosts.includes(postId) ||!post.isBookmarkedBy.includes(userId)) {
            return res.status(400).json({ message: "Post not bookmarked" });
        }

        user.bookmarkedPosts.pull(postId);
        post.isBookmarkedBy.pull(userId);
        await user.save();
        await post.save();

        res.status(200).json({ message: "Post removed from bookmarks" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};