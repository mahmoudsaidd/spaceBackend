import { asyncHandler } from "../../../services/asyncHandler.js";
import { find, create, findOneAndUpdate, findById, findByIdAndUpdate } from "../../../../Database/DBMethods.js";
import { bookingModel } from "../../../../Database/model/booking.model.js";
import { roomModel } from "../../../../Database/model/room.model.js";
import { workingSpaceModel } from "../../../../Database/model/workingSpace.model.js";


// export const createBooking= asyncHandler(async (req, res, next) => {
//     let{roomId,startTime,endTime}=req.body
//     // req.body.user=req.user._id
//     const room=await findById({model:roomModel,id:roomId})
//     if(room.isBooked==true){
//         res.json({message:"Sorry you cannot book this room"})
//     }else{
//         const createBooking= await create({model:bookingModel,
//             data:req.body});
//         if(createBooking){
//             const room=await findOneAndUpdate({
//                 model:roomModel,
//                 condition:{_id:roomId,isBooked:false},
//                 data:{isBooked:true}})
//         }
//         res.json({message:"Done",createBooking})
        
//     }
// })


export const addBooking= asyncHandler(async (req, res, next) => {
    let {room, startTime, endTime, price, user}=req.body;
     
     const overlappingBooking = await bookingModel.findOne({
         room,
         $or: [
           { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
           { startTime: { $lte: startTime }, endTime: { $gte: endTime } },
           { startTime: { $gte: startTime }, endTime: { $lte: endTime } },
         ],
       });
       if (overlappingBooking) {
         return res.status(400).json({ message: 'The room is not available at the requested time.' });
       }
       else {
         const addedBooking= await create({model:bookingModel,data:req.body});
         if(addedBooking){
             {
             const room=await findOneAndUpdate({model:roomModel,data:{isBooked:true}})
         }}
        
         res.json({message:"Done",addedBooking})
     }
       })
    

//modify booking info
export const updateBookingInfo=asyncHandler(async(req,res,next)=>{
    let {bookingId}=req.params
     let {price,duration,time,fees,promoCode}=req.body;
     let updatingBookingInfo=await findByIdAndUpdate({model:bookingModel,condition:{_id:bookingId},data:req.body,options:{new:true}})
     res.status(200).json({ message: "Updated", updatingBookingInfo });
 
 
 })
 



// export const getBookingsHistoryToWs=asyncHandler(async(req,res,next)=>{
//     let{workspaceId}=req.params
//     let ws=await findById({model:workingSpaceModel,condition:{_id:workspaceId}})
//         let history=await findById({model:bookingModel,condition:{_id:ws.Bookings._id}})
//         res.status(200).json({message:"Done",history})
//     }
   
// )
    



