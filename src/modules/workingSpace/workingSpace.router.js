import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import * as workSpaceController from './controller/workingSpace.controller.js'
import { endPoints } from "./workingSpace.endpoint.js";
const router= Router();

router.get('/getWsRooms',workSpaceController.getWsRooms)
router.get('/getAllWorkSpaces',workSpaceController.getAllWorkSpaces)

export default router;