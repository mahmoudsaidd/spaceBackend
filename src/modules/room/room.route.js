import { Router } from "express";
import * as roomController from './controller/room.controller.js'
import { HME, fileValidation, myMulter } from "../../services/multer.js";
import { auth } from "../../middleware/auth.js";
import { endPoints } from "./room.endpoint.js";
const router= Router();

router.post('/addRoom/:workspaceId',auth(endPoints.addRoom),myMulter(fileValidation.image).array("image",7),HME,roomController.addRoom)
<<<<<<< HEAD
router.get('/getRoomsForSpecificWs/:workspaceId',roomController.getRoomsForSpecificWs)
=======
router.get('/getRoomsForSpecificWs/:workspaceId',auth(endPoints.getRooms),roomController.getRoomsForSpecificWs)
router.put('/EditRoomOfWs/:roomId',auth(endPoints.editRoom),roomController.EditRoomOfWs)
router.delete('/DeLeteRoomOfWs/:roomId',auth(endPoints.deleteRoom),roomController.DeLeteRoomOfWs)
>>>>>>> 9879e11fc63ca369067d8f99d60cbd6b7cbbf070
export default router;