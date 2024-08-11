import {Group} from "../models/group.model.js";


export const createGroup = async (req, res)=>{

    try{
        const {name, bio, profilePhoto, privacy} = req.body;
        if(!name||!privacy){
            return res.status(400).json({
                message:"Something is missing",
                success: false,
            })
        }

        const existedName = await Group.findOne({name});
        if(existedName){
            return res.status(400).json({
                message:"Name already exists",
                success: false,
            })
        }

        const group = new Group({
            name: name,
            bio:bio,
            profile:{bio, profilePhoto},
            privacy:privacy,

        })
        await group.save();

        res.status(201).json({
            message: "Group created successfully",
            group,
            success: true,
        });

    }
    catch(error){
        console.log("khum bic bug gi"+"\n"+error);
    }
}

export const getGroupById = async(req, res)=>{
    try{
        const {groupId}= req.body;
        const group = await Group.findById(groupId);
        if(!group){
            return res.status(404).json({
                message: "Group not found",
                success: false,
            })
        }

        res.status(200).json({
            group,
            success: true,
        })
    }
    catch(error){
        console.log("khum bic bug gi"+"\n"+error);
    }
}

export const updateGroup = async (req, res)=>{
    try{
        const {groupId, name,bio, profilePhoto, privacy }= req.body;

        const group = await Group.findById(groupId);
        if(!group){
            return res.status(404).json({
                message:"Group not found",
                success: false,
            })
        }

        group.name = name;
        group.bio = bio;
        group.profilePhoto = profilePhoto;
        group.privacy = privacy;
        group.updateAt = Date.now();

        await group.save();

        res.status(200).json({
            message: "Group updated successfully",
            success: true,
        })

    }
    catch(error){
        console.log("khum bic bug gi"+"\n"+error);
    }
}
export const deleteGroup = async (req, res)=>{
    try{
        const {groupId}= req.body;

        const group = await Group.findById(groupId);

        if(!groupId){
            return res.status(400).json({
                message:"Something is missing",
                success: false,
            })
        }

        await group.deleteOne();

        res.status(200).json({
            message: "Group deleted successfully",
            success:true,
        })
    }
    catch(error){
        console.log("khum bic bug gi"+"\n"+error);
    }
}