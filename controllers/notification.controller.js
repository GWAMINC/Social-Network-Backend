import {Notification} from "../models/notification.model.js";

export const createNotification = async (req, res) => {
    try {
        const {userId, content} = req.body;
        if (!userId || !content) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            })
        }
        await Notification.create({
            userId,
            content,
        })
        return res.status(201).json({
            message: "Notification created successfully",
            success: true,
        })
    } catch (error) {
        console.log(error);
    }
}

export const getNotificationById = async (req, res) => {
    try {
        const {notificationId} = req.body;
        const notification = await Notification.findById(notificationId);

        if (!notification) {
            return res.status(400).json({
                message: "Notification not found",
                success: false,
            })
        }

        res.status(200).json({
            notification,
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
}

export const getNotificationByUser = async (req, res) => {
    try {
        const {userId} = req.body;

        const notifications = await Notification.find({userId});

        if (!notifications) {
            return res.status(400).json({
                message: "Nothing to show",
                success: false,
            });
        }

        res.status(200).json({
            notifications,
            success: true,
        });
    }
    catch (error) {
        console.log(error);
    }
}

export const deleteNotification = async (req, res) => {
    try {
        const {notificationId} = req.body;

            const notification = await Notification.findById(notificationId);

            if (!notification) {
                return res.status(400).json({
                    message: "Notification not found",
                    success: false,
                })
            }

            await Notification.findByIdAndDelete(notificationId);

            res.status(200).json({
                message: "Notification deleted successfully",
                success: true,
            });
        } catch (error) {
            console.log(error);
        }
}