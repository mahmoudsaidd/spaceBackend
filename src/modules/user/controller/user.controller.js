

//Owner
// import { workingSpace } from "../../../Database/model/workingSpace.model.js";
// import { insertMany } from "../../../../Database/DBMethods.js";
import { findByIdAndUpdate } from "../../../../Database/DBMethods.js";
import { bookingModel } from "../../../../Database/model/booking.model.js";
import { asyncHandler } from "../../../services/asyncHandler.js";

//Handled by backend??
export const hostRequest=asyncHandler(async(req,res,next)=>{
    // res.redirect('')
    res.json({message:"hstwtw"})
})



export const fillForm=asyncHandler(async(req,res,next)=>{
let {name,address}=req.body
// let workspace=new workspaceModel({name,address})
// let savedWorkspace=await workspace.save();
const addedWorkspce=await insertMany({model:workingSpaceModel,data:{name,address}})
res.json({message:"Done",addedWorkspce})
})




//admin validation




//Login==auth




//modify boooking info
export const updateBookingInfo=asyncHandler(async(req,res,next)=>{
   let {bookingId}=req.params
    let {price}=req.body;
    let updatingBookingInfo=await findByIdAndUpdate({model:bookingModel,condition:{_id:bookingId},data:req.body})
    res.status(200).json({ message: "Updated", updatingBookingInfo });


})

