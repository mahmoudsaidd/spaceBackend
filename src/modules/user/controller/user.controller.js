import {
  create,
  deleteOne,
  findById,
  findByIdAndDelete,
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

export const adminValidation = asyncHandler(async (req, res, next) => {
  let { ownerId, adminValidation } = req.body;
  let owner = await findById({ model: userModel, id: ownerId });
  if (!owner) {
    res.status(404).json({ message: "Owner not found" });
  } else {
    if (adminValidation == "true") {
      console.log(adminValidation);
      let accept = await findOneAndUpdate({
        model: userModel,
        condition: { adminValidation: false, role: "User" },
        data: { adminValidation: true, role: "Owner" },
        options: { new: true },
      });
      res.status(200).json({ message: "owner Accepted By Admin", accept });
    } else {
      let deleteWorkSpace = await deleteOne({
        model: workSpaceModel,
        // condition: { owner: ownerId }
        condition: { ownerId },
      });
      res.status(200).json({ message: "owner Refused By Admin" });
    }
  }
});

//modify workspaceInfo
export const updateWorkspaceInfoByOwner = asyncHandler(
  async (req, res, next) => {
    let { workspaceId } = req.params;
    let {
      name,
      description,
      holidays,
      openingTime,
      closingTime,
      rate,
      comments,
      phone,
      email,
      socialMedia,
      city,
      streetName,
      buildingNumber,
    } = req.body;
    let workspace = await findById({ model: workSpaceModel, id: workspaceId });
    if (!workspace) {
      next(new Error("Workspace not found", { cause: 404 }));
    } else {
      // hna by3ml delete ll swr el adema w by7ot a5r swr atrf3t
      if (workspace.ownerId.toString() == req.user._id.toString()) {
        if (req.files?.length) {
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
        }

        // for (const day of req.body) {
        //    workspace.schedule.holidays[day]=req.body.holidays[day]
        // }

        // ProductModel.findOneAndUpdate({productCode: userData.productCode}, dataToBeUpdated, {new: true})

        let updatedWorkspaceInfo = await findByIdAndUpdate({
          model: workSpaceModel,
          condition: { _id: workspaceId },
          data: req.body,
          options: { new: true },
        });
        // console.log(workspace.feedback.comments);
        // if (!updatedWorkspaceInfo) {
        //   if (req.body.publicImageIds) {
        //     for (const id of req.body.imagesIds) {
        //       await cloudinary.uploader.destroy(id);
        //     }
        //   }
        //   next(new Error("Database Error", { cause: 400 }));
        // } else {
        //   if (req.body.publicImageIds) {
        //     for (const id of workspace.publicImageIds) {
        //       await cloudinary.uploader.destroy(id);
        //     }
        //   }
        // }
        res.status(200).json({ message: "Updated", updatedWorkspaceInfo });
      } else {
        next(
          new Error("Sorry, you are not the owner of this workspace", {
            cause: 403,
          })
        );
      }
    }
  }
);

















//3dl f el api de m4 ele fo2
export const Update = asyncHandler(
  async (req, res, next) => {
    let { workspaceId } = req.params;
    let {
      name,
      description,
      holidays,
      openingTime,
      closingTime,
      rate,
      comments,
      phone,
      email,
      socialMedia,
      city,
      streetName,
      buildingNumber,
    } = req.body;
    let workspace = await findById({ model: workSpaceModel, id: workspaceId });
    if (!workspace) {
      next(new Error("Workspace not found", { cause: 404 }));
    } else {
      // hna by3ml delete ll swr el adema w by7ot a5r swr atrf3t
      if (workspace.ownerId.toString() == req.user._id.toString()) {
        if (req.files?.length) {
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
        }



        // workspace.feedback.rate=req.body.feedback.rate
        let updatedWorkspaceInfo = await findByIdAndUpdate({
          model: workSpaceModel,
          condition: { _id: workspaceId },
          data:{
            $set:{
              'email':req.body.email
              
            }
          },
           
          
          options: { new: true},
        });
    
    
        res.status(200).json({ message: "Updated", updatedWorkspaceInfo });
      } else {
        next(
          new Error("Sorry, you are not the owner of this workspace", {
            cause: 403,
          })
        );
      }
    }
  }
);










//hna brdo byms7 kol el obj m4 byms7 ele ana 2oltlo 3leh bs 
//delete workspaceInfo by owner
export const deleteWorkspaceInfoByOwner = asyncHandler(
  async (req, res, next) => {
    let { workspaceId } = req.params;
    let {
      name,
      description,
      image,

      holidays,
      openingTime,
      closingTime,
      rate,
      comments,
      phone,
      email,
      socialMedia,
      city,
      streetName,
      buildingNumber,
    } = req.body;
    let workspace = await findById({ model: workSpaceModel, id: workspaceId });
    if (!workspace) {
      next(new Error("Workspace not found", { cause: 404 }));
    } else {
      // if(workspace.ownerId.toString()== req.user._id.toString()){
      // if(workspace.ownerId.toString() == req.user._id.toString()){

      let deletedWorkspaceInfo = await findByIdAndUpdate({
        model: workSpaceModel,
        condition: { _id: workspaceId },
        data: {
          $pull: req.body,
        },

        options: { new: true },
      });
      res.status(200).json({ message: "Deleted", deletedWorkspaceInfo });
      //   }else{
      // next(new Error("Sorry, you are not the owner of this workspace", { cause: 403 }));

      //   }

      // cloudinary.v2.uploader.destroy('Asset_2_bdxdsl', function(error,result) {
      //   console.log(result, error) })
    }
  }
);

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
