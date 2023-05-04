import { roles } from "../../middleware/auth.js";

export const endPoints={

    addRoom:[roles.Owner],
    getRooms:[roles.Owner,roles.Admin,roles.User],
    editRoom:[roles.Owner],
    deleteRoom:[roles.Owner]
}