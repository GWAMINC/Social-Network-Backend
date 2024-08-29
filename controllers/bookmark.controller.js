import { User } from "../models/user.model.js";

export const addBookmark = async (req, res) => {
    try {
        const userId = req.id;
        const {postId} = req.body;

        const user = await User.findById(userId);
        if (user.bookmarkedPosts.includes(postId)) {
            return res.status(400).json({message: "Post already bookmarked"});
        }

        user.bookmarkedPosts.push(postId);
        await user.save();

        res.status(200).json({message: "Post bookmarked successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const getBookmarks = async (req, res) => {
    try {
        const userId = req.id;

        const user = await User.findById(userId).populate('bookmarkedPosts');

        res.status(200).json(user.bookmarkedPosts);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const deleteBookmark = async (req, res) => {
    try {
        const userId = req.id;
        const {postId} = req.body;

        const user = await User.findById(userId);
        const postIndex = user.bookmarkedPosts.indexOf(postId);
        if (postIndex === -1) {
            return res.status(400).json({ message: "Post not bookmarked" });
        }
        user.bookmarkedPosts.splice(postIndex, 1);
        await user.save();

        res.status(200).json({ message: "Post removed from bookmarks" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};