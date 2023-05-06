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
import path from "path";
import bcrypt from "bcryptjs";

//Owner
export const addWsByFillForm = asyncHandler(async (req, res, next) => {
  if (!req.files?.length) {
    return next(new Error("You have to add workspace images", { cause: 400 }));
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

  return res.status(201).json({ message: "Done", addedWorkspace });
});

export const adminValidation = asyncHandler(async (req, res, next) => {
  let { ownerId, adminValidation } = req.body;
  let owner = await findById({ model: userModel, id: ownerId });
  if (!owner) {
    return res.status(404).json({ message: "Owner not found" });
  } else {
    if (adminValidation == "true") {
      let accept = await findOneAndUpdate({
        model: userModel,
        condition: { _id: ownerId, role: "User", adminValidation: "false" },
        data: { adminValidation: "true", role: "Owner" },
        options: { new: true },
      });
      return res
        .status(200)
        .json({ message: "owner Accepted By Admin", accept });
    } else {
      let deleteWorkSpace = await deleteOne({
        model: workSpaceModel,
        condition: { ownerId },
      });
      return res
        .status(200)
        .json({ message: "owner Refused By Admin", deleteWorkSpace });
    }
  }
});

// modify workspaceInfo
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
      return next(new Error("Workspace not found", { cause: 404 }));
    } else {
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

        let updatedWorkspaceInfo = await findByIdAndUpdate({
          model: workSpaceModel,
          condition: { _id: workspaceId },
          data: req.body,
          options: { new: true },
        });

        return res
          .status(200)
          .json({ message: "Updated", updatedWorkspaceInfo });
      } else {
        return next(
          new Error("Sorry, you are not the owner of this workspace", {
            cause: 403,
          })
        );
      }
    }
  }
);

//Admin
//get client accounts  {admin}
export const getClientAccountsByAdmin = asyncHandler(async (req, res, next) => {
  const user = await find({
    model: userModel,
    condition: { $nor: [{ role: "Admin" }] },
  });
  if (user) {
    return res.json({ message: "Founded", user });
  } else {
    return res.json({ message: "Not have account" });
  }
});

//get specific account {admin}
export const getAccountByAdmin = asyncHandler(async (req, res, next) => {
  let { UserId } = req.params;
  const account = await findById({ model: userModel, id: UserId });
  if (account) {
    return res.json({ message: "Founded", account });
  } else {
    return res.json({ message: "Not have account" });
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
      return res.json({ message: "Done", deletedUser });
    } else {
      return res.json({ message: "Failed" });
    }
  }
);

//get &delete WS {admin}
export const getWorkSpaceByAdmin = asyncHandler(async (req, res, next) => {
  let { WorkSpaceId } = req.params;
  const WS = await findById({ model: workSpaceModel, id: WorkSpaceId });
  if (WS) {
    return res.json({ message: "Founded", WS });
  } else {
    return res.json({ message: "Not Founded" });
  }
});

export const deleteWorkSpaceByAdmin = asyncHandler(async (req, res, next) => {
  let { WorkSpaceId } = req.params;
  const deletedWS = await findByIdAndDelete({
    model: workSpaceModel,
    condition: { _id: WorkSpaceId },
  });
  if (deletedWS) {
    return res.json({ message: "Done", deletedWS });
  } else {
    return res.json({ message: "Failed" });
  }
});

//ProfilePic api
//HTTP method: PUT
//inputs from body:profilePic

export const profilePic = asyncHandler(async (req, res, next) => {
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

  return res.json({ message: "Done", uploadedPic });
});

export const updatePassword = asyncHandler(async (req, res) => {
  let { currentPassword, newPassword, newCPassword } = req.body;
  if (newPassword == newCPassword) {
    let user = await userModel.findById(req.user._id);
    let matched = await bcrypt.compare(currentPassword, user.password);
    if (matched) {
      let hashedPass = await bcrypt.hash(
        newPassword,
        parseInt(process.env.saltRound)
      );
      let updatedUser = await userModel.findByIdAndUpdate(
        user._id,
        { password: hashedPass },
        { new: true }
      );
      return res.json({ message: "Updated", updatedUser });
    } else {
      return res.json({ message: "currentPassword Invalid" });
    }
  } else {
    return res.json({ message: "newPassword must equal newCPassword" });
  }
});

//make an udpdate to user profile
export const updateProfile = asyncHandler(async (req, res, next) => {
  let { userId } = req.params;
  let user = await findById({ model: userModel, id: userId });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  } else {
    if (user._id.toString() == req.user._id.toString()) {
      if (req.file) {
        let { secure_url, public_id } = await cloudinary.uploader.upload(
          req.file.path,
          { folder: "profilePic" }
        );
        req.body.profilePic = secure_url;
        req.body.publicImageId = public_id;
      }

      let updatedUser = await findByIdAndUpdate({
        model: userModel,
        condition: { _id: userId },
        data: req.body,
        options: { new: true },
      });
      return res.status(200).json({ message: "Updated", updatedUser });
    } else {
      return next(
        new Error("Sorry, you are not the owner of this account", {
          cause: 403,
        })
      );
    }
  }
});