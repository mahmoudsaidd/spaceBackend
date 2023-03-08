import { asyncHandler } from "../../../services/asyncHandler.js";
import { find, create, findOneAndUpdate } from "../../../../Database/DBMethods.js";
import { bookingModel } from "../../../../Database/model/booking.model.js";
import { roomModel } from "../../../../Database/model/room.model.js";


export const addBooking= asyncHandler(async (req, res, next) => {
    const addedBooking= await create({model:bookingModel,data:req.body});
    if(addedBooking){
        const room=await findOneAndUpdate({model:roomModel,data:{isBooked:true}})
    }
    res.json({message:"Done",addedBooking})
})
    

    




