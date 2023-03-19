import { Router } from "express";
import passport from "passport";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { endPoints } from "./auth.endPoint.js";
import { signUpSchema } from "./auth.validation.js";
import * as authController from './controller/auth.controller.js'

const router = Router()


router.post('/signUp',validation(signUpSchema),authController.signUp)
router.get('/confirmEmail/:token',authController.confirmEmail)
router.get('/refreshToken/:token',authController.refreshToken)
router.post('/signIn',authController.signIn)
router.put('/updateRole',auth(endPoints.updateRole),authController.updateRole)

router.post('/sendCode',authController.sendCode)
router.post('/forgetPassword',authController.forgetPassword)


//auth google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email',] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/profile');
});




export default router























// import { Router } from "express";
// import { auth } from "../../middleware/auth.js";
// import {validation} from '../../middleware/validation.js'
// import { endPoints } from "./auth.endPoint.js";
// import { signInSchema, signUpSchema } from "./auth.validation.js";
// import * as authController from './controller/auth.controller.js'
// const router= Router();

// router.post('/signUp',validation(signUpSchema),authController.signUp)
// router.get('/confirmEmail/:token',authController.confirmEmail)
// router.get('/refreshToken/:token',authController.refreshToken)
// router.post('/signIn',validation(signInSchema),authController.signIn)
// router.put('/updateRole',auth(endPoints.updateRole),authController.updateRole)

// router.post('/sendCode',authController.sendCode)
// router.post('/forgetPassword',authController.forgetPassword)

// export default router;