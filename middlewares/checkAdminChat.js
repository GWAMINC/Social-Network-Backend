import {Chat} from "../models/chat.model.js";

export const checkAdminChat = async (req, res, next) => {
  try {
    const userId = req.id;
    const chatId = req.params;
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (!chat.admin.includes(userId)) {
      return res
        .status(403)
        .json({ message: "You do not have permission to perform this action" });
    }

    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
