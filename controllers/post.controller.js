import {Post} from "../models/post.model.js";
import {User} from "../models/user.model.js";
import {Wall} from "../models/wall.model.js";

export const createPost = async (req, res) => {
    try {
        const {userId, content, access} = req.body;

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
            userID: user._id,
            author: user.name,
            content: content,
            access: access
        })

        await post.save();

        let wall = await Wall.findOne({owner: user._id});

        if (!wall) {
            wall = new Wall ({
                owner: user._id,
                posts: [post._id]
            })
        } else {
            wall.posts.push(post._id);
        }

        await wall.save();

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

        await post.deleteOne();
        let wall = await Wall.findOne({owner: post.userID});
        const postIndex = wall.posts.indexOf(postId);
        if (postIndex > -1) {
            wall.posts.splice(postIndex, 1);
            await wall.save();
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