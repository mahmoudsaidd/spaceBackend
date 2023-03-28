import {
  create,
  deleteOne,
  findById,
  findByIdAndUpdate,
  findOneAndUpdate,
} from "../../../../Database/DBMethods.js";
import { bookingModel } from "../../../../Database/model/booking.model.js";
import { userModel } from "../../../../Database/model/user.model.js";
import { workSpaceModel } from "../../../../Database/model/workSpace.model.js";
import { asyncHandler } from "../../../services/asyncHandler.js";
import cloudinary from "../../../services/cloudinary.js";

//Owner
export const addWsByFillForm = asyncHandler(async (req, res, next) => {
  if (!req.files?.length) {
    next(new Error("You have to add workspace images", { cause: 400 }));
  } else {
    let imagesURLs = [];
    let imagesIds = [];
    for (const file of req.files) {
      let { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        { folder: "workspaces" }
      );
      imagesURLs.push(secure_url);
      imagesIds.push(public_id);
    }
    req.body.images = imagesURLs;
    req.body.publicImageIds = imagesIds;
    req.body.ownerId = req.user._id;
  }
  const addedWorkspace = await create({
    model: workSpaceModel,
    data: req.body,
  });

  res.json({ message: "Done", addedWorkspace });
});





export const adminValidation=asyncHandler(async(req,res,next)=>{
  let {ownerId,adminValidation}=req.body
  let owner=await findById({model:userModel,id:ownerId})
  if (!owner) {
        res.status(404).json({ message: "Owner not found" });
      } else {
        
          if(adminValidation=="true"){
             let accept =await findOneAndUpdate({
              model:userModel,
              condition:{adminValidation:false,role:"User"},
              data:{adminValidation:true,role:"Owner"},
              options: { new: true },
             })
        res.status(200).json({ message: "owner Accepted By Admin", accept });

        }else{
          let deleteWorkSpace = await deleteOne({
            model: workSpaceModel,
            // condition: { owner: ownerId }
            condition: {ownerId}

          });
         res.status(200).json({ message: "owner Refused By Admin" });

        }
      }
})









































//modify workspaceInfo
export const updateWorkspaceInfo = asyncHandler(async (req, res, next) => {
  let { workspaceId } = req.params;
  let { phone } = req.body;
  let updatedWorkspaceInfo = await findByIdAndUpdate({
    model: workSpaceModel,
    condition: { _id: workspaceId },
    data: req.body,
    options: { new: true },
  });
  res.status(200).json({ message: "Updated", updatedWorkspaceInfo });
});

//add Available Times By Owners

//addOffers
//modifyOffers
//ReportUser

//Client
export const searchByRate = asyncHandler(async (req, res, next) => {
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
        location: { $first: "$location" },
      },
    },
  ]);
  res.status(200).json(results);
});

//Admin
//get client account  {admin}
export const getClientAccount = asyncHandler(async (req, res, next) => {
  const user = await findById({ model: userModel, id: req.currentUserID });
  if (user) {
    res.json({ message: "Founded", user });
  } else {
    res.json({ message: "Not have account" });
  }
});

//delete client account {admin}
export const deleteClientAccount = asyncHandler(async (req, res, next) => {
  const deletedUser = await findByIdAndDelete({
    model: userModel,
    condition: { id: req.currentUserID },
  });
  if (deletedUser) {
    res.json({ message: "Done", deletedUser });
  } else {
    res.json({ message: "Failed" });
  }
});

//get &delete WS {admin}
export const getWorkSpace = asyncHandler(async (req, res, next) => {
  let { WorkSpaceId } = req.params;
  const WS = await findById({ model: workingSpaceModel, _id: WorkSpaceId });
  if (WS) {
    res.json({ message: "Founded", WS });
  } else {
    res.json({ message: "Not Founded" });
  }
});

export const deleteWorkSpace = asyncHandler(async (req, res, next) => {
  let { WorkSpaceId } = req.params;
  const deletedWS = await findByIdAndDelete({
    model: workingSpaceModel,
    condition: { id: WorkSpaceId },
  });
  if (deletedWS) {
    res.json({ message: "Done", deletedWS });
  } else {
    res.json({ message: "Failed" });
  }
});
