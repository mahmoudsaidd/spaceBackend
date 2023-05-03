import {
  create,
  deleteOne,
  findById,
  findByIdAndDelete,
  findByIdAndUpdate,
  findOneAndUpdate,
  find,
  updateOne,
} from "../../../../Database/DBMethods.js";
import { bookingModel } from "../../../../Database/model/booking.model.js";
import reviewModel from "../../../../Database/model/review.model.js";
import { userModel } from "../../../../Database/model/user.model.js";
import { workSpaceModel } from "../../../../Database/model/workSpace.model.js";
import { roles } from "../../../middleware/auth.js";
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
        condition: { _id: ownerId, role: "User", adminValidation: "false" },
        data: { adminValidation: "true", role: "Owner" },
        options: { new: true },
      });
      res.status(200).json({ message: "owner Accepted By Admin", accept });
    } else {
      let deleteWorkSpace = await deleteOne({
        model: workSpaceModel,
        // condition: { owner: ownerId }
        condition: { ownerId },
      });
      res
        .status(200)
        .json({ message: "owner Refused By Admin", deleteWorkSpace });
    }
  }
});

//modify workspaceInfo
// export const updateWorkspaceInfoByOwner = asyncHandler(
//   async (req, res, next) => {
//     let { workspaceId } = req.params;
//     let {
//       name,
//       description,
//       holidays,
//       openingTime,
//       closingTime,
//       rate,
//       comments,
//       phone,
//       email,
//       socialMedia,
//       city,
//       streetName,
//       buildingNumber,
//     } = req.body;
//     let workspace = await findById({ model: workSpaceModel, id: workspaceId });
//     if (!workspace) {
//       next(new Error("Workspace not found", { cause: 404 }));
//     } else {
//       // hna by3ml delete ll swr el adema w by7ot a5r swr atrf3t
//       if (workspace.ownerId.toString() == req.user._id.toString()) {
//         if (req.files?.length) {
//           let imagesURLs = [];
//           let imagesIds = [];
//           for (const file of req.files) {
//             let { secure_url, public_id } = await cloudinary.uploader.upload(
//               file.path,
//               { folder: "workspaces" }
//             );
//             imagesURLs.push(secure_url);
//             imagesIds.push(public_id);
//            }
//           req.body.images = imagesURLs;
//           req.body.publicImageIds = imagesIds;
//         }

//         // for (const day of req.body) {
//         //    workspace.schedule.holidays[day]=req.body.holidays[day]
//         // }

//         // ProductModel.findOneAndUpdate({productCode: userData.productCode}, dataToBeUpdated, {new: true})

//         let updatedWorkspaceInfo = await findByIdAndUpdate({
//           model: workSpaceModel,
//           condition: { _id: workspaceId },
//           data: req.body,
//           options: { new: true },
//         });
//         // console.log(workspace.feedback.comments);
//         // if (!updatedWorkspaceInfo) {
//         //   if (req.body.publicImageIds) {
//         //     for (const id of req.body.imagesIds) {
//         //       await cloudinary.uploader.destroy(id);
//         //     }
//         //   }
//         //   next(new Error("Database Error", { cause: 400 }));
//         // } else {
//         //   if (req.body.publicImageIds) {
//         //     for (const id of workspace.publicImageIds) {
//         //       await cloudinary.uploader.destroy(id);
//         //     }
//         //   }
//         // }
//         res.status(200).json({ message: "Updated", updatedWorkspaceInfo });
//       } else {
//         next(
//           new Error("Sorry, you are not the owner of this workspace", {
//             cause: 403,
//           })
//         );
//       }
//     }
//   }
// );

//3dl f el api de m4 ele fo2



export const Update = asyncHandler(async (req, res, next) => {
  let { workspaceId } = req.params;
  let workspace = await findById({ model: workSpaceModel, id: workspaceId });
  if (!workspace) {
    next(new Error("Workspace not found", { cause: 404 }));
  } else {
    const { schedule, contact, location } = req.body;
    const updatedWorkspace = new workSpaceModel({
      ...workspace.toObject(),
      schedule: { ...workspace.schedule.toObject(), ...schedule },
      contact: { ...workspace.contact.toObject(), ...contact },
      location: { ...workspace.location.toObject(), ...location }
    });
    
    await updatedWorkspace.save();
    

    // workspace.schedule.holidays = req.body.schedule?.holidays;
    // workspace.schedule.openingTime = req.body.schedule?.openingTime;
    // workspace.schedule.closingTime = req.body.schedule?.closingTime;

    // workspace.contact.phone = req.body.contact?.phone;
    // workspace.contact.email = req.body.contact?.email;
    // workspace.contact.socialMedia = req.body.contact?.socialMedia;

    // workspace.location.city = req.body.location?.city;
    // workspace.location.streetName = req.body.location?.streetName;
    // workspace.location.buildingNumber = req.body.location?.buildingNumber;
  

  await workspace.save();

  res.status(200).json({ message: "Updated", workspace });

  // hna by3ml delete ll swr el adema w by7ot a5r swr atrf3t
  if (workspace.ownerId.toString() == req.user._id.toString()) {
    // if (req.files?.length) {
    //   let imagesURLs = [];
    //   let imagesIds = [];
    //   for (const file of req.files) {
    //     let { secure_url, public_id } = await cloudinary.uploader.upload(
    //       file.path,
    //       { folder: "workspaces" }
    //     );
    //     imagesURLs.push(secure_url);
    //     imagesIds.push(public_id);
    //   }
    //   req.body.images = imagesURLs;
    //   req.body.publicImageIds = imagesIds;
    // }
    console.log(workspace.schedule.holidays);

    let updatedWorkspaceInfo = await findByIdAndUpdate({
      model: workSpaceModel,
      condition: { _id: workspaceId },
      data: req.body,

      options: { new: true },
      
    }
    
    );
    return res.json({message:"Done",updatedWorkspaceInfo})
  } else {
    next(
      new Error("Sorry, you are not the owner of this workspace", {
        cause: 403,
      })
    );
  }
}});

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

//Admin
//get client accounts  {admin}
export const getClientAccountsByAdmin = asyncHandler(async (req, res, next) => {
  const user = await find({
    model: userModel,
    condition: { $nor: [{ role: "Admin" }] },
  });
  if (user) {
    res.json({ message: "Founded", user });
  } else {
    res.json({ message: "Not have account" });
  }
});

//get specific account {admin}
export const getAccountByAdmin = asyncHandler(async (req, res, next) => {
  let { UserId } = req.params;
  const account = await findById({ model: userModel, id: UserId });
  if (account) {
    res.json({ message: "Founded", account });
  } else {
    res.json({ message: "Not have account" });
  }
});

//delete client account {admin}
export const deleteClientAccountByAdmin = asyncHandler(
  async (req, res, next) => {
    let { DId } = req.params;
    const deletedUser = await findByIdAndDelete({
      model: userModel,
      condition: { _id: DId },
    });
    if (deletedUser) {
      res.json({ message: "Done", deletedUser });
    } else {
      res.json({ message: "Failed" });
    }
  }
);

//get &delete WS {admin}
export const getWorkSpaceByAdmin = asyncHandler(async (req, res, next) => {
  let { WorkSpaceId } = req.params;
  const WS = await findById({ model: workSpaceModel, id: WorkSpaceId });
  if (WS) {
    res.json({ message: "Founded", WS });
  } else {
    res.json({ message: "Not Founded" });
  }
});

export const deleteWorkSpaceByAdmin = asyncHandler(async (req, res, next) => {
  let { WorkSpaceId } = req.params;
  const deletedWS = await findByIdAndDelete({
    model: workSpaceModel,
    condition: { _id: WorkSpaceId },
  });
  if (deletedWS) {
    res.json({ message: "Done", deletedWS });
  } else {
    res.json({ message: "Failed" });
  }
});

//ProfilePic api
//HTTP method: PUT
//inputs from body:profilePic

export const profilePic = async (req, res) => {
  if (req.file) {
    let { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: "profilePic" }
    );
    req.body.profilePic = secure_url;
    req.body.publicImageId = public_id;
  }

  let uploadedPic = await findByIdAndUpdate({
    model: userModel,
    condition: { _id: req.user._id },
    data: req.body,
    options: { new: true },
  });
  res.json({ message: "Done", uploadedPic });
};

export const getBookingsHistoryToUser = asyncHandler(async (req, res, next) => {
  let user = await findById({
    model: userModel,
    condition: { _id: req.user._id },
  });
  let history = await find({
    model: bookingModel,
    condition: { user: req.user._id },
  });
  res.status(200).json({ message: "Done", history });
});
