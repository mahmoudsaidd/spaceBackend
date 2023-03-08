import { Router } from "express";
import * as bookingController from './controller/booking.controller.js'
const router=Router()


router.post('/addBooking',bookingController.addBooking)
export default router