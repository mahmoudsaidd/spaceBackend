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
  const rooms = await find({
    model: roomModel,
    condition: { workspaceId },
  });
  const roomIds = rooms.map((room) => room._id);
  if (!ws) {
    return res.status(404).json({ message: "Workspace not found" });
  } else {

    if (
      owner._id.toString() == req.user._id.toString() 
    ) {
      let history = await find({
        model: bookingModel,
        condition: { room: { $in: roomIds } },
        
      });
    
      return res.status(200).json({ message: "Done", history });
    }else{
      return res.status(401).json({ message: "Sorry you are not the owner" });

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
    populate: {
      path: "room",
      populate: {
        path: "workspaceId",
        model: "workSpace",
      },
    },
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
        condition: { _id: bookingId, isCancelled: false ,isDone:false,isUpcoming:true,isMissed:false},
        data: { isCancelled: true ,isUpcoming:false},
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
      populate: {
        path: 'room',
        populate: {
          path: 'workspaceId',
          model: 'workSpace'
        }}
    });
    return res.status(200).json({ message: "Done", history });
  }
);



  

//marking booking as done or missed by the owner
export const markBookingAsDoneOrMissed = asyncHandler(async (req, res, next) => {
  let { bookingId } = req.params;
  let { isDone, isMissed } = req.body;
  // check if the booking exists and isUpcoming:true
  const Booking = await findById({ model: bookingModel, id: bookingId});
  if (!Booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  else{
// mark the booking as done or missed
if(req.body.isDone =="true"){
  const trueDone = await findByIdAndUpdate({
    model: bookingModel,
   condition: { _id: bookingId, isUpcoming: true },
    data: { isUpcoming: false,
            isDone: true,
            isMissed:false
       },
    options: { new: true },
  });
  res.status(200).json({message:"Done",trueDone})
}else if (req.body.isDone =="false"){
  const falseDone = await findByIdAndUpdate({
    model: bookingModel,
   condition: { _id: bookingId, isUpcoming: false },
    data: { isUpcoming: true,
            isDone: false,
       },
    options: { new: true },
  });
  res.status(200).json({message:"Done",falseDone})

}else if (req.body.isMissed == "true"){
  const trueMissed = await findByIdAndUpdate({
    model: bookingModel,
   condition: { _id: bookingId, isUpcoming: true ,isDone:false},
    data: { isUpcoming: false,
            isMissed: true,
            isDone:false
       },
    options: { new: true },
  });
  res.status(200).json({message:"Done",trueMissed})
}else if(req.body.isMissed == "false"){
  const falseMissed = await findByIdAndUpdate({
    model: bookingModel,
   condition: { _id: bookingId, isUpcoming: false ,isDone:false},
    data: { isUpcoming: true,
            isMissed: false,
       },
    options: { new: true },
  });
  res.status(200).json({message:"Done",falseMissed})
}else{
 return res.status(500).json({ message: "Failed to mark booking as done or missed" });

}


  }
});

  
export const getUpcomingBookings=asyncHandler(async(req,res,next)=>{
  let user=await findById({model:userModel,id:req.user._id})
  let bookings=await find({model:bookingModel,condition:{user,isUpcoming:true}, populate: {
    path: "room",
    populate: {
      path: "workspaceId",
      model: "workSpace",
    },
  },})
 return res.status(200).json({message:"Done",bookings})
})


export const getUpcomingBookingsToWs = asyncHandler(async (req, res, next) => {
  let { workspaceId } = req.params;
  const ws = await findById({ model: workSpaceModel, id: workspaceId });
  const owner = await findById({ model: userModel, id: ws.ownerId });
  const rooms = await find({
    model: roomModel,
    condition: { workspaceId },
  });
  const roomIds = rooms.map((room) => room._id);
  if (!ws) {
    return res.status(404).json({ message: "Workspace not found" });
  } else {

    if (
      owner._id.toString() == req.user._id.toString() 
    ) {
      let history = await find({
        model: bookingModel,
        condition: { room: { $in: roomIds }, isUpcoming: true },
        
      });
    
      return res.status(200).json({ message: "Done", history });
    }else{
      return res.status(401).json({ message: "Sorry you are not the owner" });

    }
  }
});