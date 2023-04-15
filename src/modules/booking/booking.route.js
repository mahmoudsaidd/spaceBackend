import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { endPoints } from "./booking.endpoint.js";
import { createBookingSchema } from "./booking.validation.js";
import * as bookingController from './controller/booking.controller.js'
const router=Router()


router.post('/createBooking',validation(createBookingSchema),auth(endPoints.createBooking),bookingController.addBooking)
router.put('/updateBookingInfoByOwner/:bookingId',bookingController.updateBookingInfoByOwner)
router.get('/getBookingsHistoryToWs/:workspaceId',bookingController.getBookingsHistoryToWs)
router.delete('/CancelBooking/:bookingId',auth(endPoints.CancelBooking),bookingController.CancelBooking)






router.get('/conflictBooking',bookingController.conflictBooking)
export default router