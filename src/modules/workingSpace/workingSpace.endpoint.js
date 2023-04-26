import { roles } from "../../middleware/auth.js";

export const endPoints={
    addWs:[roles.Owner],
    rate:[roles.User]
}