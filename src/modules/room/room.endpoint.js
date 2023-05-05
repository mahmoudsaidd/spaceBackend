import { roles } from "../../middleware/auth.js";

export const endPoints={

    addRoom:[roles.Owner],
    editRoom:[roles.Owner],
    deleteRoom:[roles.Owner]
}