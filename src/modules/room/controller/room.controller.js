import { create, findById } from "../../../../Database/DBMethods.js";
import { roomModel } from "../../../../Database/model/room.model.js";
import { workingSpaceModel } from "../../../../Database/model/workingSpace.model.js";
import { asyncHandler } from "../../../services/asyncHandler.js";

// export const addRoom= asyncHandler(async (req, res, next) => {
//     const savedRoom= await create({model:roomModel, data:req.body});
//     res.json({message:"Done",savedRoom})
    
//     })

export const addRoom =asyncHandler(async(req,res,next)=>{
    let{price}=req.body
    // let{ownerId}=req.user._id
    let{workspaceId}=req.params
    let workspace=await findById({model:workingSpaceModel,id:workspaceId})
    if(!workspace){
        res.status(404).json({message:"workspace not found"})
    }else{
        let room =new roomModel({price,workspaceId})
        let savedRoom=await room.save()
        res.status(201).json({message:"Added",savedRoom})
    }
})



