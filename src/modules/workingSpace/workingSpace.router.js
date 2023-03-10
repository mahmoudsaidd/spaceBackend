import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { fileValidation, HME, myMulter } from "../../services/multer.js";
import * as workSpaceController from './controller/workingSpace.controller.js'
import { endPoints } from "./workingSpace.endpoint.js";
const router= Router();

// router.get('/getWorkSpaces',workSpaceController.getWorkSpaces)
// router.post('/addWS',myMulter(fileValidation.image).array("image",7),HME,workSpaceController.addWS)
// router.get('/getBookingHistoryToWs/:WSid',workSpaceController.getBookingsForWorkingSpace)

export default router;