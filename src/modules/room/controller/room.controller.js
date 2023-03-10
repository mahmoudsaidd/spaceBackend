import { create } from "../../../../Database/DBMethods.js";
import { roomModel } from "../../../../Database/model/room.model.js";

export const addRoom= asyncHandler(async (req, res, next) => {
    const savedRoom= await create({model:roomModel, data:req.body});
    res.json({message:"Done",savedRoom})
    
    })