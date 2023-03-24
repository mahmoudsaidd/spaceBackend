import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { endPoints } from "./booking.endpoint.js";
import { createBookingSchema } from "./booking.validation.js";
import * as bookingController from './controller/booking.controller.js'
const router=Router()


router.post('/createBooking',validation(createBookingSchema),auth(endPoints.createBooking),bookingController.addBooking)
router.put('/updateBookingInfo/:bookingId',bookingController.updateBookingInfo)
router.get('/getBookingsHistoryToWs/:workspaceId',bookingController.getBookingsHistoryToWs)

router.get('/conflictBooking',bookingController.conflictBooking)
export default router