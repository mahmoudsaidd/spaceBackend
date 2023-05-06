import {
  create,
  deleteOne,
  find,
  findById,
  findByIdAndUpdate,
  findOneAndUpdate,
  updateOne,
} from "../../../../Database/DBMethods.js";

import { roomModel } from "../../../../Database/model/room.model.js";
import { userModel } from "../../../../Database/model/user.model.js";
import { workSpaceModel } from "../../../../Database/model/workSpace.model.js";
import { asyncHandler } from "../../../services/asyncHandler.js";
import cloudinary from "../../../services/cloudinary.js";

// addRoom api
// HTTP method: POST
// inputs from body:price,roomNumber,capacity,Amenities,type,roomImages,publicImageIds
export const addRoom = asyncHandler(async (req, res, next) => {
  let { price, roomNumber, capacity, Amenities, type, roomImages, roomName } =
    req.body;
  let { workspaceId } = req.params;
  let workspace = await findById({ model: workSpaceModel, id: workspaceId });
  if (!workspace) {
    return res.status(404).json({ message: "workspace not found" });
  } else {
    if (workspace.ownerId.toString() == req.user._id.toString()) {
      if (!req.files?.length) {
        return next(new Error("You have to add rooms' images", { cause: 400 }));
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
      }

      let addedRoom = await create({
        model: roomModel,
        data: {
          ...req.body,
          ...req.params,
        },
      });
      return res.status(201).json({ message: "Added", addedRoom });
    } else {
      return res.status(401).json({ message: "you are not the owner" });
    }
  }
});

export const getRoomsForSpecificWs = asyncHandler(async (req, res, next) => {
  let { workspaceId } = req.params;
  const foundedWs = await findById({ model: workSpaceModel, id: workspaceId });
  if (!foundedWs) {
    return res.status(404).json({ message: "Workspace not found" });
  } else {
    let room = await find({
      model: roomModel,
      condition: { workspaceId },
    });
    return res.json({ message: "Done", room });
  }
});

export const EditRoomOfWs = asyncHandler(async (req, res, next) => {
  let { roomId } = req.params;
  const Room = await findById({ model: roomModel, id: roomId });
  const ws = await findById({ model: workSpaceModel, id: Room.workspaceId });
  const owner = await findById({ model: userModel, id: ws.ownerId });
  if (!Room) {
    return res.status(404).json({ message: "Room not found" });
  } else {
    if (owner._id.toString() == req.user._id.toString()) {
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
    }
  }

  const updated = await findOneAndUpdate({
    model: roomModel,
    condition: { _id: roomId },
    data: req.body,
    options: { new: true },
  });
  return res.status(200).json({ message: "Updated", updated });
});

export const DeLeteRoomOfWs = asyncHandler(async (req, res, next) => {
  let { roomId } = req.params;
  const DRoom = await findById({ model: roomModel, id: roomId });
  const ws = await findById({ model: workSpaceModel, id: DRoom.workspaceId });
  const owner = await findById({ model: userModel, id: ws.ownerId });
  if (!DRoom) {
    return res.status(404).json({ message: "Room not found" });
  } else {
    if (owner._id.toString() == req.user._id.toString()) {
      const deletedRoom = await deleteOne({
        model: roomModel,
        condition: { _id: roomId },
      });
      return res.status(200).json({ message: "Deleted", deletedRoom });
    } else {
      return res
        .status(401)
        .json({
          message: "you cannot delete this room as you are not the Owner",
        });
    }
  }
});
