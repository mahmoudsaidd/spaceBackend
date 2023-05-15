import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { endPoints } from "./booking.endpoint.js";
import { createBookingSchema } from "./booking.validation.js";
import * as bookingController from "./controller/booking.controller.js";
const router = Router();

router.post(
  "/createBooking",
  validation(createBookingSchema),
  auth(endPoints.createBooking),
  bookingController.createBooking
);

router.get(
  "/getBookingsHistoryToWs/:workspaceId",
  auth(endPoints.getBookingsHistoryToWs),
  bookingController.getBookingsHistoryToWs
);
router.get(
  "/getBookingsHistoryToUser",
  auth(endPoints.getBookingsHistoryToUser),
  bookingController.getBookingsHistoryToUser
);

router.put(
  "/CancelBooking/:bookingId",
  auth(endPoints.CancelBooking),
  bookingController.CancelBooking
);

router.get(
  "/cancelledBookingsHistoryToUser",
  auth(endPoints.cancelledBookingsHistoryToUser),
  bookingController.cancelledBookingsHistoryToUser
);

router.put("/markBookingAsDoneOrMissed/:bookingId", auth(endPoints.markBookingAsDoneOrMissed), bookingController.markBookingAsDoneOrMissed);

router.get('/getUpcomingBookings',auth(),bookingController.getUpcomingBookings)


export default router;
