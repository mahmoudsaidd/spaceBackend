import { create, findById } from "../../../../Database/DBMethods.js";
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
          price,
          roomNumber,
          capacity,
          Amenities,
          type,
          roomImages,
          workspaceId,
        },
      });
      res.status(201).json({ message: "Added", addedRoom });
    } else {
      res.status(401).json({ message: "you are not the owner" });
    }
  }
});
