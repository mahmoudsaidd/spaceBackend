import { Router } from "express";
import * as roomController from './controller/room.controller.js'
import { HME, fileValidation, myMulter } from "../../services/multer.js";
import { auth } from "../../middleware/auth.js";
import { endPoints } from "./room.endpoint.js";
const router= Router();

router.post('/addRoom/:workspaceId',auth(endPoints.addRoom),myMulter(fileValidation.image).array("image",7),HME,roomController.addRoom)
router.get('/getRoomsForSpecificWs/:workspaceId',roomController.getRoomsForSpecificWs)

export default router;