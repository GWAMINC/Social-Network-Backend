import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  isGroupChat: {
    type: Boolean,
    default: false,
  },
  groupName: {
    type: String,
    trim: true,
  },
  groupPicture: {
    type: String,
  },
  admin: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Chat = mongoose.model("Chat", chatSchema);

