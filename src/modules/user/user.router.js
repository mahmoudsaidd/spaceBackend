import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import * as userController from './controller/user.controller.js'
import { endPoints } from "./user.endpoint.js";
const router= Router();


router.get('/hostRequest',userController.hostRequest)
router.post('/fillForm',auth(endPoints.fillForm),userController.fillForm)
router.put('/updateBookingInfo',userController.updateBookingInfo)
router.get('/searchByRate/:rate', userController.searchByRate)
router.get('/getClientAccount/:userId',auth(endPoints.getClientAccount),userController.getClientAccount)
router.delete('/deleteClientAccount/:userId',auth(endPoints.deleteClientAccount),userController.deleteClientAccount)
router.get('/getWorkSpace',auth(endPoints.deleteWorkSpace),userController.getWorkSpace)
router.delete('/deleteWorkSpace',auth(endPoints.deleteWorkSpace),userController.deleteWorkSpace)

export default router;