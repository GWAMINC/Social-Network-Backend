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
        const comments = await Comment.find({ postId: postId });

        // Kiểm tra nếu không tìm thấy bình luận nào


        if (!comments){
            return res.status(400).json({
                message: "Comment not found",
                success: false,
            })
        }

        const cmtdata = [];
        for (let comment of comments){
            const author = await getUserByCommentId(comment._id);

            cmtdata.push({
                commentInfo: comment,
                postId: await comment.postId,
                content: comment.content,
                userInfo: comment.author,
                likeCount: comment.isLiked.length,
                dislikeCount: comment.isDisliked.length,
                user: author._id,
            })

        }



        return res.status(200).json({
            message:"fetch comment successfully",
            comments: cmtdata,
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
        const commentId =req.params.id;

        if (!commentId){
            return res.status(400).json({
                message:"Something is missing",
                success: false,
            })
        }

        const {content} = req.body;
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
            comment: content,
        })


    }
    catch(error){
        console.log("khum bic bug gi"+"\n"+error);

    }
}
export const deleteComment = async (req, res)=>{

    try{
        const commentId= req.params.id;


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
