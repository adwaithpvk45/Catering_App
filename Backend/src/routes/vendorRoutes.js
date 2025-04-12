import express from "express"
import { protectedRoute } from "../middleware/auth.middleware.js"
import { updateVendorProfile, updateVendorProfilePic } from "../controllers/vendorController.js"
import { uploadProfilePic } from "../utils/multer.js"

const router = express.Router()

router.post("/updateVendorProfilepic",protectedRoute,uploadProfilePic.single("profileImage"),updateVendorProfilePic)

router.post("/updateVendorProfilepic",protectedRoute,updateVendorProfile)

export default router
