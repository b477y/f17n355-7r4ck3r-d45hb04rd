import express from "express";
import { authUser, registerUser, Logout, profileUser, updaterUser } from "../controllers/userController.js";
import {protact} from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/auth",authUser);
router.post("/register",registerUser);
router.post("/logout",Logout);
router.route("/profile").get(protact,profileUser).put(protact,updaterUser);

export default router;