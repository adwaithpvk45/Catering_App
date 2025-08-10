import express from "express"
import { protectedRoute } from "../middleware/auth.middleware.js"
import { updateVendorProfile, updateVendorProfilePic } from "../controllers/vendorController.js"
import { uploadProfilePic } from "../utils/multer.js"

const router = express.Router()

router.patch("/updateVendorProfilepic",protectedRoute,uploadProfilePic.single("profileImage"),updateVendorProfilePic)

router.patch("/updateVendorProfile",protectedRoute,updateVendorProfile)

// router.post("/addFood",protectedRoute,checkRole("vendor"),uploadFoodImages.single('foodImage'),addFood) // foodImage is the file name in front end wher the file input is present. 

export default router
