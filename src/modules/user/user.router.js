import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { fileValidation, HME, myMulter } from "../../services/multer.js";
import * as userController from './controller/user.controller.js'
import { endPoints } from "./user.endpoint.js";
const router= Router();

//Owner
router.post('/addWsByFillForm',auth(endPoints.addWsByFillForm),myMulter(fileValidation.image).array("image",7),HME,userController.addWsByFillForm)
router.put('/adminValidation',auth(endPoints.adminValidation),userController.adminValidation)
// router.put('/updateWorkspaceInfoByOwner/:workspaceId',auth(endPoints.updateWorkspaceInfo),myMulter(fileValidation.image).array("image",7),HME,userController.updateWorkspaceInfoByOwner)


router.put('/update/:workspaceId',auth(endPoints.updateWorkspaceInfo),myMulter(fileValidation.image).array("image",7),HME,userController.Update)


// router.get('/',userController.tryy)



router.put('/deleteWorkspaceInfoByOwner/:workspaceId',userController.deleteWorkspaceInfoByOwner)


//Client
router.get('/searchByRate/:rate', userController.searchByRate)

//Admin
router.get('/getClientAccount',auth(),userController.getClientAccount)
router.delete('/deleteClientAccount',userController.deleteClientAccount)
export default router;