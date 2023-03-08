import { roles } from "../../middleware/auth.js";

export const endPoints={
    addBooking:[roles.User]
}