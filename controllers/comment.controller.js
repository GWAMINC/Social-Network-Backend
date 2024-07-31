import {Comment} from "../models/comment.model.js";
import {Post} from "../models/post.model.js";
import {User} from "../models/user.model.js";

export const createComment = async (req, res) => {
    try {
        const {postID, authorID, content} = req.body;

        if (!postID || !authorID || !content) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            });
        }

        const post = await Post.findById(postID);
        if (!post) {
            return res.status(400).json({
                message: "Post not found",
                success: false,
            });
        }

        const user = await User.findById(authorID);
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false,
            });
        }

        const comment = new Comment({
            postID: post._id,
            author: user._id,
            content: content
        });

        await comment.save();

        res.status(201).json({
            message: "Comment created successfully",
            comment,
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}

export const getComments = async (req, res) => {
    try {
        const {postID} = req.params;

        if (!postID) {
            return res.status(400).json({
                message: "Post ID is missing",
                success: false,
            });
        }

        const comments = await Comment.find({postID}).populate('author', 'name');

        res.status(200).json({
            message: "Comments retrieved successfully",
            comments,
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}

export const updateComment = async (req, res) => {
    try {
        const {commentID, content} = req.body;

        if (!commentID || !content) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            });
        }

        const comment = await Comment.findById(commentID);
        if (!comment) {
            return res.status(400).json({
                message: "Comment not found",
                success: false,
            });
        }

        comment.content = content;
        comment.updatedAt = Date.now();

        await comment.save();

        res.status(200).json({
            message: "Comment updated successfully",
            comment,
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}

export const deleteComment = async (req, res) => {
    try {
        const {commentID} = req.body;

        if (!commentID) {
            return res.status(400).json({
                message: "Comment ID is missing",
                success: false,
            });
        }

        const comment = await Comment.findById(commentID);
        if (!comment) {
            return res.status(400).json({
                message: "Comment not found",
                success: false,
            });
        }

        await comment.deleteOne();

        res.status(200).json({
            message: "Comment deleted successfully",
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}
