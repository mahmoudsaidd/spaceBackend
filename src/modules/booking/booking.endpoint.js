import { roles } from "../../middleware/auth.js";

export const endPoints={
    createBooking:[roles.User],
    updateBookingInfoByOwner:[roles.Owner]
}