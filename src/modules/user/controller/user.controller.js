import { create, findByIdAndUpdate } from "../../../../Database/DBMethods.js";
import { bookingModel } from "../../../../Database/model/booking.model.js";
import { asyncHandler } from "../../../services/asyncHandler.js";


//Owner
//Handled by backend??
export const hostRequest=asyncHandler(async(req,res,next)=>{
    // res.redirect('')
    res.json({message:"hstwtw"})
})


export const fillForm=asyncHandler(async(req,res,next)=>{
// let {name,address}=req.body

const addedWorkspace=await create({model:workingSpaceModel,data:req.body})
res.json({message:"Done",addedWorkspace})
})




//admin validation



//modify boooking info
export const updateBookingInfo=asyncHandler(async(req,res,next)=>{
   let {bookingId}=req.params
    let {price}=req.body;
    let updatingBookingInfo=await findByIdAndUpdate({model:bookingModel,condition:{_id:bookingId},data:req.body})
    res.status(200).json({ message: "Updated", updatingBookingInfo });


})



//Client
export const searchByRate= asyncHandler(async(req, res, next) =>{
    const rate = parseInt(req.params.rate);
    const results = await workingSpaceModel.aggregate([
        { $unwind: "$feedback" },
        { $match: { "feedback.rate": { $gte: rate } } },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            images: { $first: "$images" },
            schedule: { $first: "$schedule" },
            feedback: { $push: "$feedback" },
            owner: { $first: "$owner" },
            location: { $first: "$location" }
          }
        }
      ])
    res.status(200).json(results)
    
    });

