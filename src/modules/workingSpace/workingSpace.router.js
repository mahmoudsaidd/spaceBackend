import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import * as workSpaceController from './controller/workingSpace.controller.js'
import { endPoints } from "./workingSpace.endpoint.js";
const router= Router();

router.get('/getAllWsRooms',auth(),workSpaceController.getAllWsRooms)
router.get('/getWorkSpaces',auth(),workSpaceController.getWorkSpaces)
router.get('/getBookingHistoryToWsOwner',auth(endPoints.getBookingHistoryToWsOwner),workSpaceController.getBookingHistoryToWsOwner)


//Reviews
router.post('/createReview/:workspaceId',auth(endPoints.createReview),workSpaceController.createReview)
router.get('/avgRate/:workspaceId',auth(endPoints.avgRate),workSpaceController.avgRate)
router.get('/searchByRate/:rate',workSpaceController.searchByRate)
router.get('/HighestRate',workSpaceController.HighestRate)



export default router;