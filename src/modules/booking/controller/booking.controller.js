import { asyncHandler } from "../../../services/asyncHandler.js";
import { find, create } from "../../../../Database/DBMethods.js";
import { workingSpaceModel } from "../../../../Database/model/workingSpace.model.js";
import { bookingModel } from "../../../../Database/model/booking.model.js";

export const addBooking= asyncHandler(async (req, res, next) => {
    const addedBooking= await create({model:bookingModel, data:req.body});
    res.json({message:"Done",addedBooking})
    
    })
    

