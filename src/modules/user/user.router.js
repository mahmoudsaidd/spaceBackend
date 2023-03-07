import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import * as userController from './controller/user.controller.js'
import { endPoints } from "./user.endpoint.js";
const router= Router();


router.get('/hostRequest',userController.hostRequest)
router.post('/fillForm',auth(endPoints.fillForm),userController.fillForm)
router.put('/updateBookingInfo',userController.updateBookingInfo)
router.get('/searchByRate/:rate', userController.searchByRate)

export default router;