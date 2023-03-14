import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { fileValidation, HME, myMulter } from "../../services/multer.js";
import * as userController from './controller/user.controller.js'
import { endPoints } from "./user.endpoint.js";
const router= Router();

//Owner
// router.get('/hostRequest',userController.hostRequest)
router.post('/addWsByFillForm',auth(endPoints.addWsByFillForm),myMulter(fileValidation.image).array("image",7),HME,userController.addWsByFillForm)
router.put('/updateWorkspaceInfo/:workspaceId',userController.updateWorkspaceInfo)

//Client
router.get('/searchByRate/:rate', userController.searchByRate)
router.get('/getClientAccount/:userId',auth(endPoints.getClientAccount),userController.getClientAccount)
router.delete('/deleteClientAccount/:userId',auth(endPoints.deleteClientAccount),userController.deleteClientAccount)
router.get('/getWorkSpace',auth(endPoints.deleteWorkSpace),userController.getWorkSpace)
router.delete('/deleteWorkSpace',auth(endPoints.deleteWorkSpace),userController.deleteWorkSpace)

//Admin
router.get('/getClientAccount',auth(),userController.getClientAccount)
router.delete('/deleteClientAccount',userController.deleteClientAccount)
export default router;