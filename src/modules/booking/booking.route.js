import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { endPoints } from "./booking.endpoint.js";
import * as bookingController from './controller/booking.controller.js'
const router=Router()


router.post('/createBooking',bookingController.addBooking)
router.put('/updateBookingInfo/:bookingId',bookingController.updateBookingInfo)
// router.get('/getBookingsHistoryToWs/:workspaceId',bookingController.getBookingsHistoryToWs)

export default router