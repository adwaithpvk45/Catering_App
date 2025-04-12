import express from "express"
import { updateUserProfile, updateUserProfilePic } from "../controllers/userController.js"
import { protectedRoute } from "../middleware/auth.middleware.js"
import {uploadProfilePic,uploadFoodImages} from "../utils/multer.js"

const router = express.Router()

router.post("/updateProfilePic",protectedRoute,uploadProfilePic.single("profileImage"),updateUserProfilePic)

router.post("/updateProfile",protectedRoute,updateUserProfile)

export default router