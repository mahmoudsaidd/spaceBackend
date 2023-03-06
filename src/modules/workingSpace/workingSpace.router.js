import { Router } from "express";
import * as workinggSpaceController from './controller/workingSpace.controller.js'
const router= Router();


router.post('/addWS',workinggSpaceController.addWS)



export default router;