<<<<<<< HEAD
import { create, find, findById, findByIdAndUpdate, findOneAndUpdate } from "../../../../Database/DBMethods.js";
=======
import { model } from "mongoose";
import { create, deleteOne, find, findById, findByIdAndUpdate, findOneAndUpdate, updateOne } from "../../../../Database/DBMethods.js";
>>>>>>> 9879e11fc63ca369067d8f99d60cbd6b7cbbf070
import { roomModel } from "../../../../Database/model/room.model.js";
import { workSpaceModel } from "../../../../Database/model/workSpace.model.js";
import { asyncHandler } from "../../../services/asyncHandler.js";
import cloudinary from "../../../services/cloudinary.js";

// addRoom api
// HTTP method: POST
// inputs from body:price,roomNumber,capacity,Amenities,type,roomImages,publicImageIds
export const addRoom = asyncHandler(async (req, res, next) => {
  let { price, roomNumber, capacity, Amenities, type, roomImages } = req.body;
  let { workspaceId } = req.params;
  let workspace = await findById({ model: workSpaceModel, id: workspaceId });
  if (!workspace) {
    res.status(404).json({ message: "workspace not found" });
  } else {
    if (workspace.ownerId.toString() == req.user._id.toString()) {
      if (!req.files?.length) {
        next(new Error("You have to add rooms' images", { cause: 400 }));
      } else {
        let imagesURLs = [];
        let imagesIds = [];
        for (const file of req.files) {
          let { secure_url, public_id } = await cloudinary.uploader.upload(
            file.path,
            { folder: "workspaces/rooms" }
          );
          imagesURLs.push(secure_url);
          imagesIds.push(public_id);
        }
        req.body.roomImages = imagesURLs;
        req.body.publicImageIds = imagesIds;
        // req.params.ownerId = req.user._id;
      }

      let addedRoom = await create({
        model: roomModel,
        data: {
          ...req.body,
          ... req.params},
      });
      res.status(201).json({ message: "Added", addedRoom });
    } else {
      res.status(401).json({ message: "you are not the owner" });
    }
  }
});




export const getRoomsForSpecificWs=asyncHandler(async(req,res,next)=>{
let {workspaceId}=req.params
const foundedWs=await findById({model:workSpaceModel,id:workspaceId})
if(!foundedWs){
  res.status(404).json({message:"Workspace not found"})
}else{
    let room = await find({
      model: roomModel,
      condition: { workspaceId},
    });
  res.json({ message: "Done", room });
    
  }
}
)


<<<<<<< HEAD


=======
export const EditRoomOfWs=asyncHandler(async(req,res,next)=>{
  let {roomId}=req.params;
  const Room= await findById({model:roomModel,id:roomId})
  if(!Room){
     res.status(404).json({message:"Room not found"})

  }else{
    const updated=await findOneAndUpdate({model:roomModel,condition:{_id:roomId},data:req.body,options:{new:true}})
    res.status(200).json({message:"Updated",updated})
  }

})

export const DeLeteRoomOfWs=asyncHandler(async(req,res,next)=>{
  let {roomId}=req.params;
  const DRoom= await findById({model:roomModel,id:roomId})
if(!DRoom){
  res.status(404).json({message:"Room not found"})
}else{
  const deletedRoom= await deleteOne({model:roomModel})
  res.status(200).json({message:"Deleted",deletedRoom})
}
})
>>>>>>> 9879e11fc63ca369067d8f99d60cbd6b7cbbf070
