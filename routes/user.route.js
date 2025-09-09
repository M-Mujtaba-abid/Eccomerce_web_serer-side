import express from "express";
import { getUserProfile, loginUser, logoutUser, registerUser, totalUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";


const router = express.Router();


router.post("/register", upload.single("profileImage"), registerUser);
router.post("/login",  loginUser);
router.post("/logout", logoutUser);
router.get("/totaluser", totalUser);
router.get("/getuserprofile", isAuthenticated, getUserProfile);

export default router;
