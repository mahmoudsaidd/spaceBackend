import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import * as workSpaceController from './controller/workingSpace.controller.js'
import { endPoints } from "./workingSpace.endpoint.js";
const router= Router();

router.get('/getAllWsRooms',auth(endPoints.getAllWsRooms),workSpaceController.getAllWsRooms)/////


router.get('/getWorkSpaces',auth(),workSpaceController.getWorkSpaces)


router.get('/searchWorkspacesByName',auth(endPoints.searchWorkspacesByName),workSpaceController.searchWorkspacesByName)/////



router.get('/searchWorkspacesByRegion',auth(),workSpaceController.searchWorkspacesByRegion)




//Reviews
router.post('/createReview/:workspaceId',auth(endPoints.createReview),workSpaceController.createReview)
router.get('/avgRate/:workspaceId',auth(endPoints.avgRate),workSpaceController.avgRate)
router.get('/searchByRate',auth(),workSpaceController.searchByRate)
router.get('/HighestRate',workSpaceController.HighestRate)



export default router;