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
  console.log("bookingStartHour :" + bookingStartHour);
  const bookingEndHour = new Date(endTime).getHours();
  console.log("bookingEndHour :" + bookingEndHour);

  // Convert workspace opening and closing time to hours

  const [openingHour, openingMinutes] =
    foundWorkspace.schedule.openingTime.split(":");
  const workspaceOpeningHour = parseInt(openingHour);
  //   // const OpenTime= new Date(foundWorkspace.schedule.openingTime).getHours();

  //   // const CloseTime= new Date(foundWorkspace.schedule.closingTime).getHours();
  // const workspaceOpeningHour = new Date(foundWorkspace.schedule.openingTime).getHours();
  console.log("workspaceOpeningHour :" + workspaceOpeningHour);

  const [closingHour, closingMinutes] =
    foundWorkspace.schedule.closingTime.split(":");
  const workspaceClosingHour = parseInt(closingHour);
  // const workspaceClosingHour = new Date(foundWorkspace.schedule.closingTime).getHours();
  console.log("workspaceClosingHour :" + workspaceClosingHour);

  // Check if booking time is within workspace opening and closing time
  if (
    bookingStartHour < workspaceOpeningHour ||
    bookingEndHour >= workspaceClosingHour
  ) {
    return res
      .status(400)
      .json({
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
    console.log("date: " + date);

    const dayOfWeekNumber = date.getDay();
    console.log("dayOfWeekNumber: " + dayOfWeekNumber);

    const dayOfWeekName = daysOfWeek[dayOfWeekNumber];
    console.log("dayOfWeekName :" + dayOfWeekName);
    return dayOfWeekName;
  }

  // Check if booking is on a holiday of the workspace
  const dayName = getDayOfWeek(startTime);
  console.log("dayName: " + dayName);

  const workspaceHolidays = foundWorkspace.schedule.holidays;
  console.log("workspaceHolidays: " + workspaceHolidays);

  // const holidays = Object.values(workspaceHolidays).map(dateString => getDayOfWeek(dateString));
  // console.log("holidays: "+ holidays);

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
    const cost = foundRoom.price*calculatedDuration;

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

  res.json({ message: "Done", addedBooking });
});






//modify booking info By Owner according to new booking info as duration, price, room, startTime, endTime
export const modifyBookingByOwner = asyncHandler(async (req, res, next) => {
  const { bookingId } = req.params;
  const { room, startTime, endTime } = req.body;
  if (!bookingId) {
    res.status(404).json({ message: "Booking not found" });
  } else {
    const foundBooking = await findById({
      model: bookingModel,
      id: bookingId,
    });
// check of the new  room
    const foundRoom = await findById({ model: roomModel, id: room });
    
    if (!foundRoom) {
      return res.status(404).json({ message: "Room not found" });
    }
    

    // Calculate Duration automatically
    const total = new Date(endTime).getTime() - new Date(startTime).getTime();
    const calculatedDuration = Math.floor(total / 1000) / 3600;
  
    // Store price automatically depend on room price stored on room Model
    const cost = foundRoom.price*calculatedDuration;

    // check if the requested user is the owner of the workspace or the user who booked the room
    if (user.req._id == foundBooking.user || user.req._id == foundBooking.room.workingSpace.ownerId) {
      // make the update and save the new price and duration
      const updatedBooking = await update({
        model: bookingModel,
        id: bookingId,
        data: {
          room,
          startTime,
          endTime,
          duration: calculatedDuration,
          price: cost,
        },
      });
      res.status(200).json({ message: "Done", updatedBooking });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  }
});






















export const getBookingsHistoryToWs = asyncHandler(async (req, res, next) => {
  let { workspaceId } = req.params;
  const ws = await findById({ model: workSpaceModel, id: workspaceId });
  const owner = await findById({ model: userModel, id: ws.ownerId });
  
  if (!ws) {
    res.status(404).json({ message: "Workspace not found" });
  } else {
    if (owner._id.toString() == req.user._id.toString() && ws._id==workspaceId) {
      // Ws>> Rooms>>Bookings
      // let rooms = await find({
      //   model: roomModel,
      //   condition: { workspaceId: ws._id },
      // });
      // console.log(rooms);
      let history = await find({
        model: bookingModel,
            });
      // console.log(history);
      res.status(200).json({ message: "Done", history });
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
  res.status(200).json({ message: "Done", history });
});

//Cancel Booking
export const CancelBooking = asyncHandler(async (req, res, next) => {
  let { bookingId } = req.params;
  const Booking = await findById({ model: bookingModel, id: bookingId });
  if (!Booking) {
    res.status(404).json({ message: "Booking not found" });
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

    console.log("room: ", room);
    console.log("workspace: ", workspace);
    console.log("owner: ", owner);

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

      res.status(200).json({ message: "Cancelled", bookingCancellation });
    } else {
      res.json({ message: "you cannot cancel this booking" });
    }
  }
});

//cancelledBookingsHistoryToUser api
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
    res.status(200).json({ message: "Done", history });
  })
