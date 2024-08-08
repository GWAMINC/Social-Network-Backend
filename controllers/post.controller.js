import {Feed} from "../models/feed.model.js";
import {Post} from "../models/post.model.js";
import {User} from "../models/user.model.js";
import {Wall} from "../models/wall.model.js";
import {deleteImage, uploadImage} from "../controllers/media.controller.js";
import fs from 'fs/promises';
export const createPost = async (req, res) => {
    try {
        const userId =req.id;
        const {content, access} = req.body;

        let images = [];
        try{
            images = req.files.map(file => file.path);
        }catch (error){
            console.log(error);
        }
        const uploadedImages = await uploadImage(images);


        if (!userId || !content || !access) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            })
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false,
            })
        }

        const post = new Post({
            userId: user._id,
            author: user.name,
            content: content,
            access: access,
            images : uploadedImages,
        })

        let wall = await Wall.findOne({owner: user._id});
        if (!wall) {
            wall = new Wall ({
                owner: user._id,
                posts: [post._id]
            })
        } else {
            wall.posts.push(post._id);
        }
        await post.save();
        await wall.save();
        let feed = await Feed.findOne({owner: user._id});

        if (!feed) {
            feed = new Feed ({
                owner: user._id,
                posts: [post._id]
            })
        } else {
            feed.posts.push(post._id);
        }

        await feed.save();

        //delete temporary files
        for (const image of images) {
            try {
                await fs.unlink(image);
            } catch (error) {
                console.log(error);
            }
        }

        res.status(200).json({
            message: "Post created successfully",
            wall,
            success: true,
        });
        console.log("Post created successfully");
    } catch (error) {
        console.log(error);
    }
}

export const getPostById = async (req, res) => {
    try {
        const {postId} = req.body;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(400).json({
                message: "Post not found",
                success: false,
            })
        }

        res.status(200).json({
            post,
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
}

export const updatePost = async (req, res) => {
    try {
        const {postId, content, access} = req.body;

        if (!postId || !content || !access){
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            })
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(400).json({
                message: "Post not found",
                success: false,
            })
        }

        post.content = content;
        post.access = access;
        post.updatedAt = Date.now();


        await post.save();

        res.status(200).json({
            message: "Post updated successfully",
            success: true,
        });
        console.log("Post updated successfully");
    } catch (error) {
        console.log(error);
    }
}

export const deletePost = async (req, res) => {
    try {
        const {postId} = req.body;

        if (!postId) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            })
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(400).json({
                message: "Post not found",
                success: false,
            })
        }

        await deleteImage(post.images); // delete image from cloudinary
        await post.deleteOne(); // delete post from database
        let wall = await Wall.findOne({owner: post.userId});
        const postIndex = wall.posts.indexOf(postId);
        if (postIndex > -1) {
            wall.posts.splice(postIndex, 1); // delete post from wall
            await wall.save();
        }
        let feed = await Feed.findOne({owner: post.userId});
        const postIdx = feed.posts.indexOf(postId);
        if (postIdx > -1) {
            feed.posts.splice(postIdx, 1);
            await feed.save();
        }

        res.status(200).json({
            message: "Post is deleted ",
            success: true,
        });
        console.log("Post is deleted");
    } catch (error) {
        console.log(error);
    }
}

export const likePost = async (req, res) => {
    try {
        const userId = req.id;
        const {postId} = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(400).json({
                message: "Post not found",
                success: false,
            })
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false,
            })
        }

        if (post.isLiked.includes(user._id)) {
            await post.isLiked.pull(user._id);
            await post.save();
            return res.status(400).json({
                message: "Unliked post",
                success: true,
            })
        }
        else {
            if (post.isDisliked.includes(user._id)) {
                await post.isDisliked.pull(user._id);
            }
            await post.isLiked.push(user._id);
            await post.save();
            res.status(200).json({
                message: "Liked post",
                success: true,
            });
        }
    } catch (error) {
        console.log(error);
    }
}

export const dislikePost = async (req, res) => {
    try {
        const userId = req.id;
        const {postId} = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(400).json({
                message: "Post not found",
                success: false,
            })
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false,
            })
        }

        if (post.isDisliked.includes(user._id)) {
            await post.isDisliked.pull(user._id);
            await post.save();
            return res.status(400).json({
                message: "Undisliked post",
                success: true,
            })
        }
        else {
            if (post.isLiked.includes(user._id)) {
                await post.isLiked.pull(user._id);
            }
            await post.isDisliked.push(user._id);
            await post.save();
            res.status(200).json({
                message: "Disliked post",
                success: true,
            });
        }
    } catch (error) {
        console.log(error);
    }
}