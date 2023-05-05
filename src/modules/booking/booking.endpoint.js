import { roles } from "../../middleware/auth.js";

export const endPoints={
    createBooking:[roles.User,roles.Owner],

    updateBookingInfoByOwner:[roles.Owner],
    updateBookingInfoByUser:[roles.User],

    getBookingsHistoryToWs:[roles.Owner],
    getBookingsHistoryToUser:[roles.User],

    CancelBooking:[roles.User,roles.Owner],
    cancelledBookingsHistoryToUser:[roles.User]
}