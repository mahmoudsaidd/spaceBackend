import { roles } from "../../middleware/auth.js";

export const endPoints={

    getClientAccount:[roles.Admin],
    deleteClientAccount:[roles.Admin],
    getWorkSpace:[roles.Admin],
    deleteWorkSpace:[roles.Admin],
  
    
    addWsByFillForm:[roles.User] ,
    adminValidation:[roles.Admin],
    updateWorkspaceInfo:[roles.Owner],
    deleteWorkspaceInfo:[roles.Owner]



}