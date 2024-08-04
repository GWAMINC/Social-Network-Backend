import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
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
    isRead: {
        type: Boolean,
        required: true,
        default: false
    }
})
export const Notification = mongoose.model("Notification", notificationSchema);