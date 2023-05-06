import { asyncHandler } from "../../../services/asyncHandler.js";
import {
  find,
  create,
  findOneAndUpdate,
  findById,
  findByIdAndUpdate,
  findByIdAndDelete,
  findOne,
} from "../../../../Database/DBMethods.js";
import { bookingModel } from "../../../../Database/model/booking.model.js";
import { roomModel } from "../../../../Database/model/room.model.js";
import { workSpaceModel } from "../../../../Database/model/workSpace.model.js";
import schedule from "node-schedule";

import { userModel } from "../../../../Database/model/user.model.js";

//create booking api
export const createBooking = asyncHandler(async (req, res, next) => {
  const { room, startTime, endTime } = req.body;

  const foundRoom = await findById({ model: roomModel, id: room });

  if (!foundRoom) {
    return res.status(404).json({ message: "Room not found" });
  }

  const workspaceId = foundRoom.workingSpace;

  const foundWorkspace = await findOne({
    model: workSpaceModel,
    id: workspaceId,
  });

  if (!foundWorkspace) {
    return res.status(404).json({ message: "Workspace not found" });
  }

  // Convert booking start and end time to hours
  const bookingStartHour = new Date(startTime).getHours();

  const bookingEndHour = new Date(endTime).getHours();

  // Convert workspace opening and closing time to hours

  const [openingHour, openingMinutes] =
    foundWorkspace.schedule.openingTime.split(":");
  const workspaceOpeningHour = parseInt(openingHour);

  const [closingHour, closingMinutes] =
    foundWorkspace.schedule.closingTime.split(":");
  const workspaceClosingHour = parseInt(closingHour);

  // Check if booking time is within workspace opening and closing time
  if (
    bookingStartHour < workspaceOpeningHour ||
    bookingEndHour >= workspaceClosingHour
  ) {
    return res.status(400).json({
      message: "Booking time is outside workspace opening and closing time",
    });
  }

  function getDayOfWeek(dateString) {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const date = new Date(dateString);

    const dayOfWeekNumber = date.getDay();

    const dayOfWeekName = daysOfWeek[dayOfWeekNumber];

    return dayOfWeekName;
  }

  // Check if booking is on a holiday of the workspace
  const dayName = getDayOfWeek(startTime);

  const workspaceHolidays = foundWorkspace.schedule.holidays;

  if (workspaceHolidays.includes(dayName)) {
    return res
      .status(400)
      .json({ message: "Booking is not allowed on workspace holidays" });
  }

  const overlappingBooking = await bookingModel.findOne({
    room,
    $or: [
      { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      { startTime: { $lte: startTime }, endTime: { $gte: endTime } },
      { startTime: { $gte: startTime }, endTime: { $lte: endTime } },
    ],
    isCancelled: false,
  });

  if (overlappingBooking && !overlappingBooking.isCancelled) {
    return res
      .status(400)
      .json({ message: "The room is not available at the requested time." });
  }

  // Calculate Duration automatically
  const total = new Date(endTime).getTime() - new Date(startTime).getTime();
  const calculatedDuration = Math.floor(total / 1000) / 3600;

  // Store price automatically depend on room price stored on room Model
  const cost = foundRoom.price * calculatedDuration;

  const addedBooking = await create({
    model: bookingModel,
    data: {
      room,
      startTime,
      endTime,
      user: req.user._id,
      duration: calculatedDuration,
      price: cost,
    },
  });

  return res.status(201).json({ message: "Done", addedBooking });
});

export const getBookingsHistoryToWs = asyncHandler(async (req, res, next) => {
  let { workspaceId } = req.params;
  const ws = await findById({ model: workSpaceModel, id: workspaceId });
  const owner = await findById({ model: userModel, id: ws.ownerId });

  if (!ws) {
    return res.status(404).json({ message: "Workspace not found" });
  } else {
    if (
      owner._id.toString() == req.user._id.toString() &&
      ws._id == workspaceId
    ) {
      let history = await find({
        model: bookingModel,
      });

      return res.status(200).json({ message: "Done", history });
    }
  }
});

export const getBookingsHistoryToUser = asyncHandler(async (req, res, next) => {
  let user = await findById({
    model: userModel,
    condition: { _id: req.user._id },
  });
  let history = await find({
    model: bookingModel,
    condition: { user: req.user._id },
  });
  return res.status(200).json({ message: "Done", history });
});

//Cancel Booking
export const CancelBooking = asyncHandler(async (req, res, next) => {
  let { bookingId } = req.params;
  const Booking = await findById({ model: bookingModel, id: bookingId });
  if (!Booking) {
    return res.status(404).json({ message: "Booking not found" });
  } else {
    //Booking >> Room >> WS >> Owner
    let room = await findById({
      model: roomModel,
      id: Booking.room,
    });
    let workspace = await findById({
      model: workSpaceModel,
      id: room.workspaceId,
    });
    let owner = await findById({ model: userModel, id: workspace.ownerId });

    if (
      req.user._id.toString() === Booking.user.toString() ||
      req.user._id.toString() === owner.id.toString()
    ) {
      const bookingCancellation = await findOneAndUpdate({
        model: bookingModel,
        condition: { _id: bookingId, isCancelled: false },
        data: { isCancelled: true },
        options: { new: true },
      });

      return res
        .status(200)
        .json({ message: "Cancelled", bookingCancellation });
    } else {
      return res.json({ message: "you cannot cancel this booking" });
    }
  }
});

//cancelledBookingsHistoryToUser api

export const cancelledBookingsHistoryToUser = asyncHandler(
  async (req, res, next) => {
    let user = await findById({
      model: userModel,
      condition: { _id: req.user._id },
    });
    let history = await find({
      model: bookingModel,
      condition: { user: req.user._id, isCancelled: true },
    });
    return res.status(200).json({ message: "Done", history });
  }
);
