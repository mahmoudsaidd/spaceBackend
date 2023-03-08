import { asyncHandler } from "../../../services/asyncHandler.js";
import {create, find, findById } from "../../../../Database/DBMethods.js";
import { workingSpaceModel } from "../../../../Database/model/workingSpace.model.js";
import { roomModel } from "../../../../Database/model/room.model.js";
import { bookingModel } from "../../../../Database/model/booking.model.js";



export const addWS= asyncHandler(async (req, res, next) => {
    const savedWs= await create({model:workingSpaceModel, data:req.body});
    res.json({message:"Done",savedWs})
    
    })



// export const getBookingHistoryToWs=asyncHandler(async(req,res,next)=>{
//     let{workspaceId}=req.params
//     const History=await findById({model:workingSpaceModel,id:workspaceId,select:'Bookings',populate:'Bookings'})
//     res.status(200).json({message:"Done",History})
// })
    

// export const getBookingsForWorkingSpace= asyncHandler(async (req,res,next) => {
//     let {WSid}=req.params;
//     const workspace=await findById({model:workingSpaceModel,id:WSid})
//     const allBookings= await find({model:bookingModel,condition:{_id:WSid}, populate:{path:'room'}, populate:{path:'workingSpace'}})
//     res.status(200).json(allBookings)
// })

export const getBookingsForWorkingSpace=async (req,res) => {
    let {WSid}=req.params;
  try {
    const bookings = await bookingModel.find({}).populate({
      path: 'room',
      populate: {
        path: 'workingSpace',
        match: { _id: WSid }
      }
    });
    return bookings.filter(booking => booking.room.workingSpace !== null);
  } catch (err) {
    console.error(err);
    return null;
  }
}







export const addRoom= asyncHandler(async (req, res, next) => {
        const savedRoom= await create({model:roomModel, data:req.body});
        res.json({message:"Done",savedRoom})
        
        })