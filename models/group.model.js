import mongoose from "mongoose";
const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    profile: {
        bio: {
            type: String,
        },
        profilePhoto: {
            type: String,
            default: "",
        },
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
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
    privacy: {
        type: String,
        required: true,
        enum: ["private", "public"],
    },
})

export const Group = mongoose.model("Group", groupSchema);