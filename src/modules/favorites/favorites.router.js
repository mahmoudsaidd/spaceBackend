import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { endPoints } from "./favorites.endPoints.js";
import * as favoritesController from "./controller/favorites.controller.js";
const router = Router();


router.put("/addFavorites/:workspaceId", auth(endPoints.addFavorites), favoritesController.addFavorites);
router.put("/removeFavorites/:workspaceId", auth(endPoints.removeFavorites), favoritesController.removeFavorites);
router.get("/getFavorites", auth(endPoints.getFavorites), favoritesController.getFavorites);


export default router