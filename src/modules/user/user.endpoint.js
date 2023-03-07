import { roles } from "../../middleware/auth.js";

export const endPoints={
    fillForm:[roles.Owner]
}