import mongoose from "mongoose";

const feedSchema=new mongoose.Schema({
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    }
})
export const Feed=mongoose.model("Feed",feedSchema)