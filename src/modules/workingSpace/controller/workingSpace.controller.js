import { asyncHandler } from "../../../services/asyncHandler.js";
import {create, find, findById } from "../../../../Database/DBMethods.js";
import { roomModel } from "../../../../Database/model/room.model.js";
import { bookingModel } from "../../../../Database/model/booking.model.js";
import { workSpaceModel } from "../../../../Database/model/workSpace.model.js";

// workingspace/room/booking


// get a list of ws from db
export const getAllWorkSpaces=asyncHandler(async(req,res,next)=>{
    let workSpace=await find({model:workSpaceModel})
    res.status(200).json({message:"Done",workSpace})

})



export const getWsRooms=asyncHandler(async(req,res,next)=>{
    const cursor = await workingSpaceModel.find().cursor();
    let allWorkspaces=[]
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    let room=await find({model:roomModel,condition:{workspaceId:doc._id}})
    let newObj= doc.toObject()  // doc heya kol ws 3ndi 7wltaha l newObj 3shan hea json , wl newObj da b2a el array bta3 el room el 7b3to lel ws
    newObj.room=room
    allWorkspaces.push(newObj);
    }
    res.json({message:"Done",allWorkspaces})
})




    




// export const getBookingsForWorkingSpace= asyncHandler(async (req,res,next) => {
//     let {WSid}=req.params;
//     const workspace=await findById({model:workingSpaceModel,id:WSid})
//     const allBookings= await find({model:bookingModel,condition:{_id:WSid}, populate:{path:'room'}, populate:{path:'workingSpace'}})
//     res.status(200).json(allBookings)
// })

// export const getBookingsForWorkingSpace=async (req,res) => {
//     let {WSid}=req.params;
//   try {
//     const bookings = await bookingModel.find({}).populate({
//       path: 'room',
//       populate: {
//         path: 'workingSpace',
//         match: { _id: WSid }
//       }
//     });
//     return bookings.filter(booking => booking.room.workingSpace !== null);
//   } catch (err) {
//     console.error(err);
//     return null;
//   }







