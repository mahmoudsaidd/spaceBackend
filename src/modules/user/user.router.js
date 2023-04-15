import { Router } from "express";
import { auth, roles } from "../../middleware/auth.js";
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
router.get('/getClientAccountsByAdmin',auth(endPoints.getClientAccount),userController.getClientAccountsByAdmin)
router.get('/getAccountByAdmin/:UserId',auth(endPoints.getClientAccount),userController.getAccountByAdmin)
router.delete('/deleteClientAccountByAdmin/:DId',auth(endPoints.deleteClientAccount),userController.deleteClientAccountByAdmin)
router.get('/getWorkSpaceByAdmin/:WorkSpaceId',auth(endPoints.getWorkSpace),userController.getWorkSpaceByAdmin)
router.delete('/deleteWorkSpaceByAdmin/:WorkSpaceId',auth(endPoints.deleteWorkSpace),userController.deleteWorkSpaceByAdmin)
export default router;