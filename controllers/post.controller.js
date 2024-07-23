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
            message: "Post successfully",
            wall,
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
}