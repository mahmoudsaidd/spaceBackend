import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import * as workSpaceController from './controller/workingSpace.controller.js'
import { endPoints } from "./workingSpace.endpoint.js";
const router= Router();

router.get('/getWsRooms',workSpaceController.getWsRooms)
router.get('/getAllWorkSpaces',workSpaceController.getWorkSpaces)


router.post('/createReview/:workspaceId',auth(endPoints.createReview),workSpaceController.createReview)

// router.post('/rating/:WorkSpaceId',workSpaceController.rating)

router.get('/avgRate/:workspaceId',auth(endPoints.avgRate),workSpaceController.avgRate)
<<<<<<< HEAD
router.get('/searchByRate/:rate', workSpaceController.searchByRate)
router.get('/HighestRate',workSpaceController.HighestRate)
=======
>>>>>>> b4661c831477a1f5d0189fe864fc26e84c6c8b1a

export default router;