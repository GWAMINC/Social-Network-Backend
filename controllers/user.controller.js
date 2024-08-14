import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Wall } from "../models/wall.model.js";
import { Feed } from "../models/feed.model.js";
import {Post} from "../models/post.model.js";
export const register = async (req, res) => {
    try {
        const { name, email, password, phoneNumber, role } = req.body;
        if (!name || !email || !password || !phoneNumber || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            });
        }
        const user = await User.findOne({email});
        if (user) {
            return res.status(400).json({
                message: "User already exists",
                success: false,
            })
        }
        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashPassword,
            phoneNumber,
            role,
        });
        await Wall.create({
            owner: newUser._id,
        });
        await Feed.create({
            owner: newUser._id,
        });
        return res.status(201).json({
            message: "User created successfully",
            success: true,
        })
    } catch (error) {
        console.log(error);
    }
}

export const login = async (req, res) => {
    try {
        console.log(req.body);
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            })
        }

        let user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({
                message: "incorrect email",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "incorrect password",
                success: false,
            })
        }
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account does not exist with current role",
                success: false,
            })
        }

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {expiresIn: "1d"});

        user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, {maxAge: 24*60*60*1000, httpOnly: true, sameSite: 'strict'}).json({
            message: `Welcome back ${user.name}`,
            user,
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", {maxAge:0}).json({
            message: "Logout successfully",
            success: true,
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { name, email, phoneNumber, bio, birthDate } = req.body;
        if (!name || !email || !phoneNumber) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            })
        }
        const userId = req.id; //middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false,
            })
        }
        user.name = name,
            user.email = email,
            user.phoneNumber = phoneNumber,
            user.profile.bio = bio,
            user.profile.birthDate = birthDate

        await user.save();

        user =  {
            _id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            profile: user.profile
        }

        return res.status(200).json({
            message: "User updated successfully",
            user,
            success: true,
        })
    } catch (error) {
        console.log(error);
    }
}
export const getProfile = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: 'User not found' });

        return res.status(200).json({ user, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const followUser = async (req, res) => {
    try {
        const userId = req.id;
        const {followedId} = req.body;

        const user = await User.findById(userId);
        const followedUser = await User.findById(followedId);
        if (!user || !followedUser) {
            return res.status(400).json({
                message: "User not found",
                success: false,
            })
        }
        if (user.following.includes(followedId)) {
            return res.status(400).json({
                message: "This user already followed",
                success: false,
            })
        }

        user.following.push(followedId);
        followedUser.isFollowed.push(userId);

        await user.save();
        await followedUser.save();

        return res.status(200).json({
            message: "Follow "+followedUser.name +" successfully",
            success: true,
        })

    } catch (error) {
        console.log(error);
    }
}

export const unfollowUser = async (req, res) => {
    try {
        const userId = req.id;
        const {unfollowedId} = req.body;

        const user = await User.findById(userId);
        const unfollowedUser = await User.findById(unfollowedId);
        if (!user || !unfollowedUser || userId === unfollowedId) {
            return res.status(400).json({
                message: "User not found",
                success: false,
            })
        }
        if (!user.following.includes(unfollowedId)) {
            return res.status(400).json({
                message: "This user already unfollowed",
                success: false,
            })
        }
        user.following.pull(unfollowedId);
        unfollowedUser.isFollowed.pull(userId);

        await user.save();
        await unfollowedUser.save();

        return res.status(200).json({
            message: "Unfollow "+unfollowedUser.name +" successfully",
            success: true,
        })
    } catch (error) {
        console.log(error);
    }
}

export const getUserByPostId = async (postId) => {
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return null;
        }
        const user = await User.findById(post.userId);
        return user;
    } catch (error) {
        console.log(error);
    }
}