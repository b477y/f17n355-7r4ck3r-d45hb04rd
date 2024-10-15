import {
  login,
  register,
  logout,
  profileUser,
  updateUser,
} from "../controllers/userController.js";
import { protact } from "../middleware/authmiddleware.js";
import express from "express";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.route("/profile").get(protact, profileUser).put(protact, updateUser);


export default router;
