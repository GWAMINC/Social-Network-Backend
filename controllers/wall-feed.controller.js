import { Feed } from "../models/feed.model.js";
import { Wall } from "../models/wall.model.js";

export const getFeed = async (req, res) => {
  try {
    const userId = req.id; 
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const feed = await Feed.findOne({ owner: userId }); 
    if (!feed) {
      return res.status(404).json({ message: 'Feed not found' });
    }
    res.status(200).json(feed);
  } catch (error) {
    console.error('Error getting feed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const getWall = async (req, res) => {
  try {
    const userId = req.id; 
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const wall = await Wall.findOne({ owner: userId }); 
    if (!wall) {
      return res.status(404).json({ message: 'Wall not found' });
    }
    res.status(200).json(wall);
  } catch (error) {
    console.error('Error getting wall:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};