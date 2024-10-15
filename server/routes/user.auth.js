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
<<<<<<< HEAD
// router.route("/profile").get(protact, profileUser).put(protact, updaterUser);
=======
router.route("/profile").get(protact, profileUser).put(protact, updateUser);
>>>>>>> 84b5a4ea1303b242e9d79b0fd76684373fd36765

export default router;
