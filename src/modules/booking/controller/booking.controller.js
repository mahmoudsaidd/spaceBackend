import { asyncHandler } from "../../../services/asyncHandler.js";
import {
  find,
  create,
  findOneAndUpdate,
  findById,
  findByIdAndUpdate,
  findByIdAndDelete,
} from "../../../../Database/DBMethods.js";
import { bookingModel } from "../../../../Database/model/booking.model.js";
import { roomModel } from "../../../../Database/model/room.model.js";
import { workSpaceModel } from "../../../../Database/model/workSpace.model.js";
import schedule from "node-schedule";

import moment from "moment";
import { userModel } from "../../../../Database/model/user.model.js";
// var a = moment().format('MMMM Do YYYY, h:mm:ss a');
// var b =moment().format('LLLL');
// var b =moment().toDate();

// console.log(b);

export const addBooking = asyncHandler(async (req, res, next) => {
  let { room, startTime, endTime } = req.body;
  let foundedRoom = await findById({ model: roomModel, id: room });
  if (!foundedRoom) {
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
    const workspaceOpeningHour = new Date(
      foundWorkspace.schedule[0].openingTime
    ).getHours();
    const workspaceClosingHour = new Date(
      foundWorkspace.schedule[0].closingTime
    ).getHours();

    // Check if booking time is within workspace opening and closing time
    if (
      bookingStartHour < workspaceOpeningHour ||
      bookingEndHour > workspaceClosingHour
    ) {
      return res.status(400).json({
        message: "Booking time is outside workspace opening and closing time",
      });
    }
  

    // validating booking on holidays
  function getDayOfWeek(dateString) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    const dayOfWeekNumber = date.getDay();
    const dayOfWeekName = daysOfWeek[dayOfWeekNumber];
    return dayOfWeekName;
  }
  
    // Check if booking is on a holiday of the workspace
    const dayName= getDayOfWeek(startTime)
    const workspaceHolidays = foundWorkspace.schedule[0].holidays;
    const holidays = workspaceHolidays.map(dateString => getDayOfWeek(dateString));
    console.log(holidays) //el moshkela hena en el holidays de betraga3 value wa7da f array el holidays
    // w betmna3 el booking fel youm elly betraga3o da bas
    console.log(dayName)
    if (holidays.includes(dayName)) {
      return res.status(400).json({ message: "Booking is not allowed on workspace holidays" });
    }


    const overlappingBooking = await bookingModel.findOne({
      room,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        { startTime: { $lte: startTime }, endTime: { $gte: endTime } },
        { startTime: { $gte: startTime }, endTime: { $lte: endTime } },
      ],
    });
    if (overlappingBooking) {
      return res
        .status(400)
        .json({ message: "The room is not available at the requested time." });
    } 


    //Calculate Duration automatic
    const total = new Date(endTime).getTime() - new Date(startTime).getTime();
    const calculatedDuration = Math.floor(total / 1000) / 3600;
    console.log(calculatedDuration);
    //Store price automatic depend on room price stored on room Model and duration
    const cost = foundedRoom.price*calculatedDuration;
    console.log(cost);


      const addedBooking = await create({
        model: bookingModel,
        data: {
          room,
          startTime,
          endTime,
          price: cost,
          user: req.user._id,
          duration: calculatedDuration,
        },
      });

// el isBooked ba2a malhash lazma el mafrod??

      if (addedBooking) {
        {
          const room = await findOneAndUpdate({
            model: roomModel,
            condition: { isBooked: false },
            data: { isBooked: true },
          });
        }
      }

      res.json({ message: "Done", addedBooking });
    }
  
);

//modify booking info By Owner
export const updateBookingInfoByOwner = asyncHandler(async (req, res, next) => {
  let { bookingId } = req.params;
  let { price, room, startTime, endTime, user, fees, promoCode } = req.body;

  const total = new Date(endTime).getTime() - new Date(startTime).getTime();
  const calculatedDuration = Math.floor(total / 1000) / 3600;
  console.log(calculatedDuration);

  let updatingBookingInfo = await findByIdAndUpdate({
    model: bookingModel,
    condition: { _id: bookingId },
    data: {
      price,
      room,
      startTime,
      endTime,
      user,
      fees,
      promoCode,
      duration: calculatedDuration,
    },
    options: { new: true },
  });
  res.status(200).json({ message: "Updated", updatingBookingInfo });
});




//kont 7ata property esmha 'Bookings' f el model w kant 48ala bs 4kl 8erna el logic tany w el propert etms7t 3shan kda mkn4 2areha , ana 3dltha 5las 3ala a5r update 
export const getBookingsHistoryToWs = asyncHandler(async (req, res, next) => {
  let { workspaceId } = req.params;
  const ws =await findById({model:workSpaceModel,id:workspaceId})
  if(!ws){
res.status(404).json({message:"Workspace not found"})
  }else{
    // Ws>> Rooms>>Bookings
    let rooms=await find({model:roomModel,condition:{workspaceId:ws._id}})
    console.log(rooms);
    let history = await find({
      model: bookingModel,
      condition: { room: rooms },
    });
    console.log(history);
    res.status(200).json({ message: "Done", history });
  }
});



export const conflictBooking = async (req, res, next) => {
  let currentTime = new Date();
  let bookings = await find({
    model: bookingModel,
    condition: {
      //startTime=2 ,endTime=4 ,currentTime=3
      startTime: { $lte: currentTime },
      endTime: { $gte: currentTime },
    },
  });

  res.status(200).json({ message: "Done", bookings });
};


// CancelBooking api 
// HTTP method: DELETE
// inputs from params:bookingId
// roles:user who making this booking or the owner of the workspace that have this booking
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
      req.user._id.toString() ===Booking.user.toString()  ||
       req.user._id.toString() === owner.id.toString()
    ) {
      const bookingCancellation = await findOneAndUpdate({
        model: bookingModel,
        condition: { _id: bookingId },
        data: { isCancelled: true },
      });
      // const deletedBooking = await findByIdAndDelete({
      //   model: bookingModel,
      //   condition: { _id: bookingId },
      // });
      res.status(200).json({ message: "Cancelled", bookingCancellation });
    } else {
      res.json({ message: "you cannot cancel this booking" });
    }
  }
});


//3ayez yetgarab lesa bardo
export const cancelledBookingsHistoryToUser = asyncHandler(async (req, res, next) => {
  let user = await findById({
    model: userModel,
    condition: { _id:req.user._id },
  });
  let history = await find({
    model: bookingModel,
    conditions: [{ user: req.user._id }, { isCancelled: true }],
  });
  res.status(200).json({ message: "Done", history });
});



//Lessaaa
// export const CancelledBookings=asyncHandler(async(req,res,next)=>{
// const cancelledBookings=await find({model:bookingModel})
// // if(req.user._id ===cancelledBookings.user){

// // }
// res.status(200).json({message:cancelledBookings})
// })




