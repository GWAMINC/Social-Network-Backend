import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    author: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    access: {
        type: String,
        required: true,
        enum: ["private", "public"],
    },
    isLiked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isDisliked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    images:[{
        type: String,
        default : ""
    }]
})

export const Post = mongoose.model("Post", postSchema);