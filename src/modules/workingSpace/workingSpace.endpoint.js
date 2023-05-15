import { roles } from "../../middleware/auth.js";

export const endPoints={
    getBookingHistoryToWsOwner:[roles.Owner],
    createReview:[roles.User],
    avgRate:[roles.User,roles.Admin,roles.Owner],


    getAllWsRooms:[roles.User,roles.Admin],
    searchWorkspacesByName:[roles.User,roles.Admin]
}