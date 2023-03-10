import { Router } from "express";
import * as roomController from './controller/room.controller.js'
const router= Router();

router.post('/addRoom',roomController.addRoom)


export default router;