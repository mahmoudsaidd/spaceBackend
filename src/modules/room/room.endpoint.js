import { roles } from "../../middleware/auth.js";

export const endPoints={

    addRoom:[roles.Owner, roles.User],
    editRoom:[roles.Owner],
    deleteRoom:[roles.Owner]
}