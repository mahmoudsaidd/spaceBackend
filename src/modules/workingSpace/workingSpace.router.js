import { Router } from "express";
import * as workSpaceController from './controller/workingSpace.controller.js'
const router= Router();


router.post('/addWS',workSpaceController.addWS)



export default router;