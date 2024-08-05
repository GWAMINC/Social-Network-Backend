import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
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