import { roles } from "../../middleware/auth.js";

export const endPoints={
    fillForm:[roles.Owner],
    getClientAccount:[roles.Admin],
    deleteClientAccount:[roles.Admin],
    getWorkSpace:[roles.Admin],
    deleteWorkSpace:[roles.Admin],
  
    


}