import {Comment} from "../models/comment.model.js";
import {Post} from "../models/post.model.js";
import {User} from "../models/user.model.js";


export const createComment = async (req, res) => {
    try {
        const { postID, userID, content } = req.body;

        if (!postID || !userID || !content) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            });
        }

        // Tìm user theo userID
        const user = await User.findById(userID);
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false,
            });
        }

        // Tạo đối tượng comment mới
        const comment = new Comment({
            postID: postID,
            userID: user._id,
            author: user.name,
            content: content,
        });

        // Lưu comment vào cơ sở dữ liệu
        await comment.save();

        // Thêm comment vào post tương ứng
        const post = await Post.findById(postID);
        if (!post) {
            return res.status(400).json({
                message: "Post not found",
                success: false,
            });
        }

        await post.save();

        res.status(201).json({
            message: "Comment created successfully",
            comment,
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const updateComment = async (req, res) => {
    try {
        const { commentId, content } = req.body;

        if (!commentId || !content) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            });
        }

        const comment = await Comment.findById(commentId);

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
            success: true,
        });
        console.log("Comment updated successfully");
    } catch (error) {
        console.log(error);
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.body;

        if (!commentId) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            });
        }

        const comment = await Comment.findById(commentId);
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
        console.log("Comment deleted successfully");
    } catch (error) {
        console.log(error);
    }
};
