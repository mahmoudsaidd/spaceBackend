import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { fileValidation, HME, myMulter } from "../../services/multer.js";
import * as userController from './controller/user.controller.js'
import { endPoints } from "./user.endpoint.js";
const router= Router();

//Owner

router.post('/addWsByFillForm',auth(endPoints.addWsByFillForm),myMulter(fileValidation.image).array("image",7),HME,userController.addWsByFillForm)
router.put('/updateWorkspaceInfo/:workspaceId',userController.updateWorkspaceInfo)
router.put('/adminValidation',userController.adminValidation)

//Client
router.get('/searchByRate/:rate', userController.searchByRate)

//Admin
router.get('/getClientAccount',auth(),userController.getClientAccount)
router.delete('/deleteClientAccount',userController.deleteClientAccount)
export default router;