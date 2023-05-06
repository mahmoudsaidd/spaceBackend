import { asyncHandler } from "../../../services/asyncHandler.js";
import {
  create,
  find,
  findById,
  findByIdAndUpdate,
  findOne,
  findOneAndUpdate,
} from "../../../../Database/DBMethods.js";
import { roomModel } from "../../../../Database/model/room.model.js";
import { bookingModel } from "../../../../Database/model/booking.model.js";
import cloudinary from "../../../services/cloudinary.js";
import { workSpaceModel } from "../../../../Database/model/workSpace.model.js";
import reviewModel from "../../../../Database/model/review.model.js";

// workingspace/room/booking

export const getAllWsRooms = asyncHandler(async (req, res, next) => {
  const cursor = await workSpaceModel.find().cursor();
  let allWorkspaces = [];
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    let room = await find({
      model: roomModel,
      condition: { workspaceId: doc._id },
    });
    let newObj = doc.toObject();
    newObj.room = room;
    allWorkspaces.push(newObj);
  }
  return res.status(200).json({ message: "Done", allWorkspaces });
});

// get a list of ws from db
export const getWorkSpaces = asyncHandler(async (req, res, next) => {
  let workSpace = await find({ model: workSpaceModel });
  return res.status(200).json({ message: "Done", workSpace });
});

export const getBookingHistoryToWsOwner = asyncHandler(
  async (req, res, next) => {
    let { workspaceId } = req.params;
    let workspace = await findById({ model: workSpaceModel, id: workspaceId });
    if (!workspace) {
      return res.status(404).json({ message: "workspace not found" });
    } else {
      const owner = workspace.ownerId;
      const History = await find({
        model: bookingModel,
        condition: {
          "room.workspaceId": workspaceId,
          owner: req.user._id,
        },
      });
      return res.status(200).json({ message: "Done", History });
    }
  }
);

export const createReview = asyncHandler(async (req, res, next) => {
  let { workspaceId } = req.params;
  let { rating } = req.body;

  const workspace = await findById({ model: workSpaceModel, id: workspaceId });
  if (!workspace) {
    return res.status(404).json({ message: "Workspace not found" });
  } else {
    const existingReview = await findOne({
      model: reviewModel,
      condition: {
        createdBy: req.user._id,
        workspace: workspaceId,
      },
    });
    if (existingReview) {
      return res
        .status(401)
        .json({ message: "Sorry,you can only add one review per workspace" });
    } else {
      const review = await create({
        model: reviewModel,
        data: {
          createdBy: req.user._id,
          workspace: workspaceId,
          rating,
        },
      });
      return res.status(201).json({ message: "Created", review });
    }
  }
});

//avgRate
export const avgRate = asyncHandler(async (req, res, next) => {
  let { workspaceId } = req.params;
  const Workspace = await findById({ model: workSpaceModel, id: workspaceId });
  if (!Workspace) {
    return res.status(404).json({ message: "Workspace not found" });
  } else {
    const reviews = await find({
      model: reviewModel,
      condition: { workspace: workspaceId },
    });
    const totalReviews = reviews.length;
    // initial Counter
    let totalRating = 0;
    for (let i = 0; i < totalReviews; i++) {
      totalRating += reviews[i].rating;
    }
    const avgRating = totalRating / totalReviews;
    const avgRate = await findByIdAndUpdate({
      model: workSpaceModel,
      condition: { _id: workspaceId },
      data: { avgRate: avgRating },
    });
    return res.status(200).json({ message: "Done", avgRating });
  }
});

export const searchByRate = asyncHandler(async (req, res, next) => {
  let { rate } = req.params;
  const WsRate = await find({
    model: reviewModel,
    condition: { rating: rate },
  });
  if (WsRate.length) {
    return res.status(200).json({ message: "founded", WsRate });
  } else {
    return res
      .status(404)
      .json({ message: "not founded WorkSpace have this rate" });
  }
});

export const HighestRate = asyncHandler(async (req, res, next) => {
  const HRate = await workSpaceModel.find().sort({ avgRate: 1 });
  return res.status(200).json({ message: "Done", HRate });
});
