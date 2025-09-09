import express from "express";
import { getUserProfile, loginUser, logoutUser, registerUser, totalUser, updatePassword, updateUserProfile } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";


const router = express.Router();


router.post("/register", upload.single("profileImage"), registerUser);
router.post("/login",  loginUser);
router.post("/logout", logoutUser);
router.get("/totaluser", totalUser);
router.get("/getuserprofile", isAuthenticated, getUserProfile);
router.patch("/updateuserprofile", isAuthenticated, upload.single("profileImage"), updateUserProfile);
router.patch("/updatepassword", isAuthenticated, updatePassword);

export default router;
