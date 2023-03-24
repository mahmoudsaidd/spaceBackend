import { asyncHandler } from "../../../services/asyncHandler.js";
import {
  find,
  create,
  findOneAndUpdate,
  findById,
  findByIdAndUpdate,
} from "../../../../Database/DBMethods.js";
import { bookingModel } from "../../../../Database/model/booking.model.js";
import { roomModel } from "../../../../Database/model/room.model.js";
import { workSpaceModel } from "../../../../Database/model/workSpace.model.js";

import moment from "moment";
// var a = moment().format('MMMM Do YYYY, h:mm:ss a');
// var b =moment().format('LLLL');
// var b =moment().toDate();

// console.log(b);


export const addBooking = asyncHandler(async (req, res, next) => {
  let { room, startTime, endTime, price } = req.body;
let foundedRoom =await findById({model:roomModel,id:room})
if(!foundedRoom){
  res.status(404).json({ message: "Room not found" });

}else{
    //Calculate Duration automatic
    const total = new Date(endTime).getTime() - new Date(startTime).getTime();
    const calculatedDuration = Math.floor(total / 1000) / 3600;
    console.log(calculatedDuration);
  //Store price automatic depend on room price stored on room Model
  const cost=foundedRoom.price
  console.log(cost);

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
    } else {
      const addedBooking = await create({
        model: bookingModel,
        data: {
          room,
          startTime,
          endTime,
          price:cost,
          user: req.user._id,
          duration: calculatedDuration,
        },
      });
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
}

});




















//modify booking info
export const updateBookingInfo = asyncHandler(async (req, res, next) => {
  let { bookingId } = req.params;
  let { price, duration, time, fees, promoCode } = req.body;
  let updatingBookingInfo = await findByIdAndUpdate({
    model: bookingModel,
    condition: { _id: bookingId },
    data: req.body,
    options: { new: true },
  });
  res.status(200).json({ message: "Updated", updatingBookingInfo });
});

export const getBookingsHistoryToWs = asyncHandler(async (req, res, next) => {
  let { workspaceId } = req.params;
  let ws = await findById({
    model: workingSpaceModel,
    condition: { _id: workspaceId },
  });
  let history = await findById({
    model: bookingModel,
    condition: { _id: Bookings },
  });
  res.status(200).json({ message: "Done", history });
});

export const conflictBooking = async (req, res, next) => {
  let currentTime = new Date();
  let bookings = await find({
    model: bookingModel,
    condition: {
      startTime: { $lte: currentTime },
      endTime: { $gte: currentTime },
    },
  });
  res.status(200).json({ message: "Done", bookings });
};

// npm install --save node-cron
// const cron = require('node-cron');
// cron.schedule('0 9 * * *', () => {
//   // Function to run
// });
// 0 */59 * * * *
