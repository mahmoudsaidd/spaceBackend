import { roles } from "../../middleware/auth.js";



export const endPoints = {
  addFavorites: [roles.Admin, roles.User],
  removeFavorites: [roles.Admin, roles.User],
  getFavorites: [roles.Admin, roles.User],
};