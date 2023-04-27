import { roles } from "../../middleware/auth.js";

export const endPoints={
    addWs:[roles.Owner],
    createReview:[roles.User],
    avgRate:[roles.User,roles.Admin,roles.Owner]
}