import express from "express"
import { updateUserProfile, updateUserProfilePic } from "../controllers/userController.js"
import { protectedRoute } from "../middleware/auth.middleware.js"
import {uploadProfilePic} from "../utils/multer.js"

const router = express.Router()

router.patch("/updateProfilePic",protectedRoute,uploadProfilePic.single("profileImage"),updateUserProfilePic)

router.patch("/updateProfile",protectedRoute,updateUserProfile)

export default router