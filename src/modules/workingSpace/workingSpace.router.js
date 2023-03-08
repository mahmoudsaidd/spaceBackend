import { Router } from "express";
import * as workSpaceController from './controller/workingSpace.controller.js'
const router= Router();


router.post('/addWS',workSpaceController.addWS)
router.get('/getBookingHistoryToWs/:WSid',workSpaceController.getBookingsForWorkingSpace)
router.post('/addRoom',workSpaceController.addRoom)

export default router;