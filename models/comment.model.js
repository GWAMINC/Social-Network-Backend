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
    isLike:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
},{timestamps: true})







export const Comment = mongoose.model("Comment", commentSchema);