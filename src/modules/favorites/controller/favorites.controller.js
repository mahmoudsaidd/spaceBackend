import { findById, findByIdAndUpdate } from "../../../../Database/DBMethods.js";
import { workSpaceModel } from "../../../../Database/model/workSpace.model.js";
import { userModel } from "../../../../Database/model/user.model.js";
import { asyncHandler } from "../../../services/asyncHandler.js";

export const addFavorites = asyncHandler(async (req, res, next) => {
  let { workspaceId } = req.params;
  let founded = await findById({ model: workSpaceModel, id: workspaceId });
  if (!founded) {
    return next(new Error("workspace not found", { cause: 404 }));
  }
  let updated = await findByIdAndUpdate({
    model: userModel,
    condition: req.user._id,
    data: {
      $addToSet: { favorites: workspaceId },
    },
    options: { new: true },
  });

  return res.status(200).json({ message: "Done", updated });
});

export const removeFavorites = asyncHandler(async (req, res, next) => {
  let { workspaceId } = req.params;
  let founded = await findById({ model: workSpaceModel, id: workspaceId });
  if (!founded) {
    return next(new Error("workspace not found", { cause: 404 }));
  }
  let updated = await findByIdAndUpdate({
    model: userModel,
    condition: req.user._id,
    data: {
      $pull: { favorites: workspaceId },
    },
    options: { new: true },
  });

  return res.status(200).json({ message: "Done", updated });
});

//make a function return favorites of the user
export const getFavorites = asyncHandler(async (req, res, next) => {
  let founded = await findById({ model: userModel, id: req.user._id });
  if (!founded) {
    return next(new Error("user not found", { cause: 404 }));
  }
  let favorites = founded.favorites;
  return res.status(200).json({ message: "Done", favorites });
});
