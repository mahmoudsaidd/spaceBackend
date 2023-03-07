import { create, findByIdAndUpdate } from "../../../../Database/DBMethods.js";
import { bookingModel } from "../../../../Database/model/booking.model.js";
import { workingSpaceModel } from "../../../../Database/model/workingSpace.model.js";
import { asyncHandler } from "../../../services/asyncHandler.js";
import cloudinary from "../../../services/cloudinary.js";


//Owner
//Handled by backend??
export const hostRequest=asyncHandler(async(req,res,next)=>{
    // res.redirect('')
    res.json({message:"hstwtw"})
})


export const fillForm=asyncHandler(async(req,res,next)=>{
// let {name,address}=req.body
if(!req.files?.length){
  next(new Error("You have to add workspace images",{cause:400}))
}else{
  let imagesURLs=[]
  let imagesIds=[]
  for (const file of req.files){
    let{secure_url,public_id}=await cloudinary.uploader.upload(
      file.path,
      {folder:"workspaces"}
    )
    imagesURLs.push(secure_url)
    imagesIds.push(public_id)
  }
  req.body.images=imagesURLs
  req.body.publicImageIds = imagesIds;


}
const addedWorkspace=await create({model:workingSpaceModel,data:req.body})
res.json({message:"Done",addedWorkspace})
})




//admin validation



//modify boooking info
export const updateBookingInfo=asyncHandler(async(req,res,next)=>{
   let {bookingId}=req.params
    let {price}=req.body;
    let updatingBookingInfo=await findByIdAndUpdate({model:bookingModel,condition:{_id:bookingId},data:price})
    res.status(200).json({ message: "Updated", updatingBookingInfo });


})

//modify workspaceInfo




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

