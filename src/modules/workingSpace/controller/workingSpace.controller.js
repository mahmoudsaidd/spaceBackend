import { asyncHandler } from "../../../services/asyncHandler.js";
import {create, find, findById } from "../../../../Database/DBMethods.js";
import { workingSpaceModel } from "../../../../Database/model/workingSpace.model.js";
import { roomModel } from "../../../../Database/model/room.model.js";
import { bookingModel } from "../../../../Database/model/booking.model.js";
import cloudinary from "../../../services/cloudinary.js";
import { workSpaceModel } from "../../../../Database/model/workSpace.model.js";

// workingspace/room/booking


// get a list of ws from db
// export const getWorkSpaces=asyncHandler(async(req,res,next)=>{
//     let workSpace=await find({model:workingSpaceModel})
//     res.status(200).json({message:"Done",workSpace})

// })


// export const addWS= asyncHandler(async (req, res, next) => {
//     if (!req.files?.length) {
//         next(new Error("You have to add images", { cause: 400 }));
//       } else {
//         let imagesURLs = [];
//         let imagesIds = [];
//         for (const file of req.files) {
//           let { secure_url, public_id } = await cloudinary.uploader.upload(
//             file.path,
//             { folder: "Workspaces" }
//           );
//           imagesURLs.push(secure_url);
//           imagesIds.push(public_id);
//         }
//         req.body.images = imagesURLs;
//         req.body.publicImageIds = imagesIds;
//         let workspace=await create({model:workingSpaceModel,
//             data:{
//                 images: secure_url,
//                 owner: req.user._id,
//                 publicImageId: public_id,
//             }
//         })
//         if (!workspace) {
//             for (const id of imagesIds) {
//             await cloudinary.uploader.destroy(id);
//             }
//             next(new Error("Error when insert to DB", { cause: 400 }));
//         } else {
//             res.status(201).json({ message: "Created", workspace });
//         }
//             }

//     const savedWs= await create({model:workingSpaceModel, data:req.body});
//     res.json({message:"Done",savedWs})
    
//     })



export const getBookingHistoryToWs=asyncHandler(async(req,res,next)=>{
    let{workspaceId}=req.params
    const History=await find({model:bookingModel,'room.workingSpace':workspaceId})
    res.status(200).json({message:"Done",History})
})
    
export const feedback=asyncHandler( async (req, res, next) => {
    const workspaceId = req.params.id;
    const feedback = req.body.feedback;
  
    
      const workspace = await workSpaceModel.findById(workspaceId);
  
      workspace.feedback.push(feedback);
      await workspace.save();
  
      res.status(200).json(workspace);
    
  }); //3amel function 3ashan el feedback yet3amal men ay user w yet3amalo save fel model automatic
  // mesh e7na elly no7oto w e7na bene3mel create lel workspace



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







