import express from "express";
import { loginUser, logoutUser, registerUser, totalUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.js";


const router = express.Router();


router.post("/register", upload.single("profileImage"), registerUser);
router.post("/login",  loginUser);
router.post("/logout", logoutUser);
router.get("/totaluser", totalUser);

export default router;
