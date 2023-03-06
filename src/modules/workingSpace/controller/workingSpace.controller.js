import { asyncHandler } from "../../../services/asyncHandler.js";
import { find, create } from "../../../../Database/DBMethods.js";
import { workingSpaceModel } from "../../../../Database/model/workingSpace.model.js";

export const addWS= asyncHandler(async (req, res, next) => {
    const savedWs= await create({model:workingSpaceModel, data:req.body});
    res.json({message:"Done",savedWs})
    
    })
    

