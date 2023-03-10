import { roles } from "../../middleware/auth.js";

export const endPoints={
    addWsByFillForm:[roles.User] //3shan ele 7ymli el form lsa still user k role awl ma al admin y validate 7yb2a owner
}