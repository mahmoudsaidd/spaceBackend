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






//modify booking info By Owner
//hna y2dr y update kol 7aga t5os el booking 3shan hwa el owner
export const updateBookingInfoByOwner = asyncHandler(async (req, res, next) => {
  let { bookingId } = req.params;
  const booking = await findById({ model: bookingModel, id: bookingId });
  const room = await findById({ model: roomModel, id: booking.room });
  console.log(room._id);
  const ws = await findById({ model: workSpaceModel, id: room.workspaceId });
  const owner = await findById({ model: userModel, id: ws.ownerId });
  
  if (!booking) {
    res.status(404).json({ message: "Not found" });
  } else {
    if (owner._id.toString() == req.user._id && booking.isCancelled == false) {
      let { price, room, startTime, endTime, fees, promoCode } = req.body;

      let calculatedDuration = booking.duration;
      if (startTime && startTime != booking.startTime || endTime && endTime != booking.endTime) {
        const total = new Date(endTime).getTime() - new Date(startTime).getTime();
        calculatedDuration = Math.floor(total / 1000) / 3600;
      }
     
      
      // if (room._id.toString() != req.body.room.toString()) {
      //   req.body.price = room.price * calculatedDuration;
      // }
      
    // req.body.price=room.price*calculatedDuration
      let updatingBookingInfo = await findByIdAndUpdate({
        model: bookingModel,
        condition: { _id: bookingId },
        data:{
          price,
           room, 
           startTime, 
           endTime, 
           fees, 
           promoCode,
           duration:calculatedDuration
        },
        options: { new: true },
      });
      res.status(200).json({ message: "Updated", updatingBookingInfo });
    } else {
      res.status(404).json({ message: "Unsuccessful update" });
    }
  }
});




//updateBookingInfoByUser
//hna el user y2dr y update 7agat mo3yna zay eno y8ye el room aw startTime aw endTime
export const updateBookingInfoByUser = asyncHandler(async (req, res, next) => {
  let { bookingId } = req.params;
 const booking=await findById({model:bookingModel,id:bookingId})
 if(!booking){

 }else{
  if(booking.user.toString()== req.user._id.toString()){

    let { room, startTime, endTime } = req.body;

    // const total = new Date(endTime).getTime() - new Date(startTime).getTime();
    // const calculatedDuration = Math.floor(total / 1000) / 3600;
    // console.log(calculatedDuration);
  
    let calculatedDuration = booking.duration;
    if (startTime && startTime != booking.startTime || endTime && endTime != booking.endTime) {
      const total = new Date(endTime).getTime() - new Date(startTime).getTime();
      calculatedDuration = Math.floor(total / 1000) / 3600;
    }


    let updatingBookingInfo = await findByIdAndUpdate({
      model: bookingModel,
      condition: { _id: bookingId },
      data: {
        room,
        startTime,
        endTime,
        user: req.user._id,
        duration: calculatedDuration,
      },
      options: { new: true },
    });
    res.status(200).json({ message: "Updated", updatingBookingInfo });
  }else{
    res.status(401).json({ message: "You are not authorized to update this booking" });

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
