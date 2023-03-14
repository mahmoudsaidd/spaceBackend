import { Router } from "express";
import * as roomController from './controller/room.controller.js'
const router= Router();

router.post('/addRoom/:workspaceId',roomController.addRoom)


export default router;