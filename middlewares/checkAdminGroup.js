import { Group } from "../models/group.model.js";

export const checkAdminGroup=async(req,res,next)=>{
    try {
        const userId=req.id;
        const groupId=req.params;
        const group=await Group.findById(groupId);
        if(!group){
            return res.status(404).json({message:"Group not found"})
        }
        if(!group.admin.includes(userId)){
            return res.status(403).json({message:"you is not admin"});
        }
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

}