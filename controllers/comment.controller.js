import {Comment} from "../models/comment.model.js";
import {Post} from "../models/post.model.js";
import {User} from "../models/user.model.js";
import {getUserByCommentId} from "./user.controller.js";


export const createComment = async (req, res) => {

    try {
        const userId = req.id;
        const { postId,content} = req.body;

        if (!userId||!postId||!content){
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            })
        }

        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({
                message:"User not found",
                success: false,
            })
        }
        const post = await Post.findById(postId);
        if (!post){
            return res.status(400).json({
                message:"Post not found",
                success: false
            })
        }

        const comment = new Comment({
            userId: user._id,
            postId: post._id,
            author: user.name,
            content: content
        })
        await comment.save();


        res.status(201).json({
            message: "Comment created successfully",
            comment,
            success: true,
        });

    } catch(error) {
        console.log("khum bic bug gi"+"\n"+error);
    }
}
export const getAllComment = async (req, res) => {
    try {
        const postId = req.params.id;
        if(!postId){
            return res.status(400).json({
                message: "Post not found",
                success: false,
            })
        }
        // const comment = await Comment.find({postId: postId});
        // if (!comment) {
        //     return res.status(400).json({
        //         message: "Comment not found",
        //         success: false,
        //     });
        // }
        // Tìm tất cả các bình luận liên quan đến postId
        const comments = await Comment.find({postId: postId});

        if (!comments){
            return res.status(400).json({
                message: "Comment not found",
                success: false,
            })
        }

        return res.status(200).json({
            message:"fetch comment successfully",
            comments: comments,
            success: true,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "An error occurred while fetching comments",
            success: false,
        });
    }
}


export const updateComment = async (req, res) =>{
    try{
        const {commentId, content} = req.body;

        if (!commentId||!content){
            return res.status(400).json({
                message:"Something is missing",
                success: false,
            })
        }
        const comment = await Comment.findById(commentId);

        if(!comment){
            return res.status(400).json({
                message: "Comment not found",
                success: false,
            })
        }
        comment.content = content;
        comment.updateAt = Date.now();

        await comment.save();

        res.status(200).json({
            message: "Comment updated successfully",
            success: true,
        })


    }
    catch(error){
        console.log("khum bic bug gi"+"\n"+error);

    }
}
export const deleteComment = async (req, res)=>{

    try{
        const {commentId}= req.body;


        if(!commentId){
            return res.status(400).json({
                message:"Something is missing",
                success:false,
            })
        }

        const comment = await Comment.findById(commentId);
        if(!comment){
            return res.status(400).json({
                message:"Comment not found",
                success: false,
            })
        }
        await comment.deleteOne();

        res.status(200).json({
            message: "Comment is deleted",
            success: true,
        });
    }
    catch(error){
        console.log("khum bic bug gi"+"\n"+error);
    }
}
