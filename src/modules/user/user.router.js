import { Router } from "express";
import * as userController from './controller/user.controller.js'
const router= Router();


router.get('/hostRequest',userController.hostRequest)
router.post('/fillForm',userController.fillForm)
router.put('/updateBookingInfo',userController.updateBookingInfo)


export default router;