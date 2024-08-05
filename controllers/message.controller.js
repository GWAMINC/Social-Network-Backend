import { Message } from "../models/message.model.js";

export const createMessage = async (req, res) => {
  const userId = req.id;
  const { chat, content, media } = req.body;
  if (!chat || !content) {
    return res
      .status(400)
      .json({ message: "Chat ID and content are required" });
  }
  const message = new Message({
    chat,
    author: userId,
    content,
    media,
  });
  await message.save();
  res.status(200).json({ message: "Message created successfully", message });
};

export const getMessage = async (req, res) => {
  try {
    const { chatID } = req.body;
    if (!chatID) {
      return res.status(400).json({ message: "Chat ID is required" });
    }
    const message = await Message.find({ chat: chatID });
    res.status(200).json(message);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateMessage = async (req, res) => {
  try {
    const { messageId, content, media, isRead } = req.body;
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    message.content = content || message.content;
    message.media = media || message.media;
    message.updateAt = Date.now();

    await message.save();
    res.status(200).json(message);
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.body;
    if (!messageId) {
      return res.status(400).json({ message: "Message ID is required" });
    }
    const deletedMessage = await Message.findByIdAndDelete(messageId);
    if (!deletedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    res
      .status(200)
      .json({ message: "Message deleted successfully", deletedMessage });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const findMessage = async (req, res) => {};
