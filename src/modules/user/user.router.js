import { Router } from "express";
import { auth, roles } from "../../middleware/auth.js";
import { fileValidation, HME, myMulter } from "../../services/multer.js";
import * as userController from "./controller/user.controller.js";
import { endPoints } from "./user.endpoint.js";
import { validation } from "../../middleware/validation.js";
import { updatePasswordSchema } from "./user.validation.js";
const router = Router();

//Owner
router.post(
    "/addWsByFillForm",
    auth(endPoints.addWsByFillForm),
    myMulter(fileValidation.image).array("image", 7),
    HME,
    userController.addWsByFillForm
);
router.put(
    "/adminValidation",
    auth(endPoints.adminValidation),
    userController.adminValidation
);

router.put('/updateWorkspaceInfoByOwner/:workspaceId',auth(endPoints.updateWorkspaceInfo),
myMulter(fileValidation.image).array("image",7),HME,userController.updateWorkspaceInfoByOwner)







//Client
router.put(
    "/profilePic",
   auth(endPoints.profilePic),
    myMulter(fileValidation.image).single("image"),
    HME,
    userController.profilePic
);

router.patch("/updatePassword",validation(updatePasswordSchema),auth(),userController.updatePassword)


router.put('/updateProfile/:userId',auth(endPoints.updateProfile),myMulter(fileValidation.image).single("image"),
HME,userController.updateProfile)











//Admin
router.get(
    "/getClientAccountsByAdmin",
    auth(endPoints.getClientAccount),
    userController.getClientAccountsByAdmin
);
router.get(
    "/getAccountByAdmin/:UserId",
    auth(endPoints.getClientAccount),
    userController.getAccountByAdmin
);
router.delete(
    "/deleteClientAccountByAdmin/:DId",
    auth(endPoints.deleteClientAccount),
    userController.deleteClientAccountByAdmin
);
router.get(
    "/getWorkSpaceByAdmin/:WorkSpaceId",
    auth(endPoints.getWorkSpace),
    userController.getWorkSpaceByAdmin
);
router.delete(
    "/deleteWorkSpaceByAdmin/:WorkSpaceId",
    auth(endPoints.deleteWorkSpace),
    userController.deleteWorkSpaceByAdmin
);
export default router;
