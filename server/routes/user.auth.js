import {
  login,
  register,
  logout,
  profileUser,
  updateUser,
} from "../controllers/userController.js";
import { protect } from "../middleware/authmiddleware.js";
import express from "express";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get('/profile', protect, profileUser); // Protecting the profile route
router.put('/profile/update', protect, updateUser);


export default router;
