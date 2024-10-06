import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Post"
    },

    author: {  // Thay đổi đây từ ObjectId sang String
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    isLiked:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    isDisliked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    images:{
        type: String,
        default : ""
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    parentCommentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Comment',
        default:null
    },
    replies:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Comment',
    }]
})







export const Comment = mongoose.model("Comment", commentSchema);