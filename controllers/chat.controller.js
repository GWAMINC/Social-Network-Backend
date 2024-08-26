import {Chat} from "../models/chat.model.js";

//get chat by  id
export const getChat=async(req,res)=>{
  try {
    const chat=await Chat.findById(req.params.id)
    if(!chat){
      return res.status(400).json({
        success:false,
        message:'Chat not found'
      })
    }
    res.status(200).json(chat)
  } catch (error) {
    res.status(500).json({
      success:false,
      message: error.message
    })
  }
}
//get all chat
export const getAllChat = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    const chats = await Chat.find({
      participants: { $in: [userId] },
    });
    console.log(chats);
    return res.status(200).json({chats: chats});
  } catch (error) {
    console.error("Error fetching chats:", error.message); // Log the error with a message
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const createChat = async (req, res) => {
  try {
    const { participants, isGroupChat, groupName, groupPicture, admin} = req.body;
    const chat = new Chat({
      participants,
      isGroupChat,
      groupName,
      groupPicture,
      admin
    });
    await chat.save();
    res.status(200).json({
      success: true,
      chat,
    });
  } catch (error) {
    console.error("Error creating chat:", error.message); // Log the error with a message
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateChat = async (req, res) => {
  try {
    const { groupName, groupPicture } = req.body;
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    if (!chat.admin.includes(req.id)) { //set by an authentication middleware
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }

    chat.groupName = groupName || chat.groupName;
    chat.groupPicture = groupPicture || chat.groupPicture;
    chat.updatedAt = Date.now();

    await chat.save();
    res.status(200).json(chat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete chat
export const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    if (!chat.admin.includes(req.id)) { // set by an authentication middleware
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }
    await Chat.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add user
export const addUser = async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (!chat.admin.includes(req.id)) {
      return res.status(403).json({ message: 'Only admins can add users to the group' });
    }

    if (!chat.participants.includes(userId)) {
      chat.participants.push(userId);
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remove user
export const removeUser = async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (!chat.admin.includes(req.id)) {
      return res.status(403).json({ message: 'Only admins can remove users from the group' });
    }
    chat.participants = chat.participants.filter(participant => participant.toString() !== userId);
    await chat.save();

    res.status(200).json(chat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// User leaves group 
export const leaveGroup = async (req, res) => {
  try {
    const { chatId } = req.body;
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    chat.participants = chat.participants.filter(participant => participant.toString() !== req.id);
    await chat.save();

    res.status(200).json(chat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
