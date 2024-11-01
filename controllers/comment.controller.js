import {Comment} from "../models/comment.model.js";
import {Post} from "../models/post.model.js";
import {User} from "../models/user.model.js";



export const createComment = async (req, res) => {

    try {
        const userId = req.id;
        const { postId,content, parentCommentId} = req.body;

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
            content: content,
            parentCommentId: parentCommentId || null,
        })
        await comment.save();


        if(parentCommentId){
            const parentComment = await Comment.findById(parentCommentId);
            if(!parentComment){
                await parentComment.deleteOne();
                return res.status(400).json({
                    message:"Parent comment not found",
                    success: false,
                })
            }
            parentComment.replies.push(comment._id);
            await parentComment.save();

        }



        res.status(201).json({
            message: "Comment created successfully",
            comment,
            success: true,
        });

    } catch(error) {
        console.log("khum bic bug gi\n"+error);
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
        const comments = await Comment.find({postId: postId,parentCommentId: null})



        if (comments.length===0){
            return res.status(400).json({
                message: "Comment not found",
                success: false,
            })
        }


        const cmtdata = await Promise.all(comments.map(async (comment) => {


            return {
                commentInfo: comment,
                replies: comment.replies
            };
        }));




        return res.status(200).json({
            message:"fetch comment successfully",
            comments: cmtdata,
            success: true,
        });
    } catch (error) {
        console.log("khum bic bug gi\n",error);

        return res.status(500).json({
            message: "An error occurred while fetching comments",
            success: false,
        });
    }
}
export const getReplies = async (req, res) => {
    try {
        const parentCommentId = req.params.id;

        if (!parentCommentId) {
            return res.status(400).json({
                message: "Parent comment not found",
                success: false,
            });
        }

        const fetchReplies = async (parentCommentId) => {
            const replies = await Comment.find({ parentCommentId }).lean(); // Lấy tất cả replies có parent là parentCommentId

            const nestedReplies = await Promise.all(
                replies.map(async (reply) => {
                    const childReplies = await fetchReplies(reply._id); // Đệ quy lấy replies con của reply hiện tại
                    return {
                        replyInfo: reply,
                        replies: childReplies, // Gán các replies con vào reply hiện tại
                    };
                })
            );
            return nestedReplies;
        };

        const replies = await fetchReplies(parentCommentId);
        console.log(replies);
        return res.status(200).json({
            message: "Replies fetched successfully",
            replies: replies,
            success: true,
        });

    } catch (error) {
        console.error("Error fetching nested replies: ", error);
        return res.status(500).json({
            message: "An error occurred while fetching replies",
            success: false,
        });
    }
};


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
        await Comment.updateMany(
            { replies: commentId },           // Find comments with the commentId in their replies array
            { $pull: { replies: commentId } }  // Pull/remove the commentId from the replies array
        );

        res.status(200).json({
            message: "Comment is deleted",
            success: true,
        });
    }
    catch(error){
        console.log("khum bic bug gi"+"\n"+error);
    }
}
