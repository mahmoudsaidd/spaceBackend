import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { fileValidation, HME, myMulter } from "../../services/multer.js";
import * as userController from './controller/user.controller.js'
import { endPoints } from "./user.endpoint.js";
const router= Router();

//Owner
// router.get('/hostRequest',userController.hostRequest)
router.post('/fillForm',auth(endPoints.fillForm),myMulter(fileValidation.image).array("image",7),HME,userController.fillForm)
router.put('/updateBookingInfo/:bookingId',userController.updateBookingInfo)
router.put('/updateWorkspaceInfo/:workspaceId',userController.updateWorkspaceInfo)

//Client
router.get('/searchByRate/:rate', userController.searchByRate)

//Admin
router.get('/getClientAccount',auth(),userController.getClientAccount)
router.delete('/deleteClientAccount',userController.deleteClientAccount)
export default router;