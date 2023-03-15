import { roles } from "../../middleware/auth.js";

export const endPoints={

    fillForm:[roles.Owner],
    getClientAccount:[roles.Admin],
    deleteClientAccount:[roles.Admin],
    getWorkSpace:[roles.Admin],
    deleteWorkSpace:[roles.Admin],
  
    



    addWsByFillForm:[roles.User] //3shan ele 7ymli el form lsa still user k role awl ma al admin y validate 7yb2a owner

}