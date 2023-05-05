import { roles } from "../../middleware/auth.js";

export const endPoints={

    addWsByFillForm:[roles.User] ,
    adminValidation:[roles.Admin],
    updateWorkspaceInfo:[roles.Owner],
    deleteWorkspaceInfo:[roles.Owner],

    getClientAccount:[roles.Admin],
    deleteClientAccount:[roles.Admin],
    getWorkSpace:[roles.Admin],
    deleteWorkSpace:[roles.Admin],
    

    profilePic:[roles.Admin,roles.User,roles.Owner],
  
    updateProfile:[roles.User,roles.Owner,roles.Owner]
    
   



}