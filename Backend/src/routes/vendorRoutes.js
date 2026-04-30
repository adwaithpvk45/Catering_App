import express from "express"
import { protectedRoute } from "../middleware/auth.middleware.js"
import { updateVendorProfile, updateVendorProfilePic } from "../controllers/vendorController.js"
import { uploadProfilePic } from "../utils/multer.js"

import { getVendorStats, getVendorServices, getMyVendorBookings } from "../controllers/vendorDashboardController.js"

const router = express.Router()

// Profile Updates
router.patch("/updateVendorProfilepic",protectedRoute,uploadProfilePic.single("profileImage"),updateVendorProfilePic)
router.patch("/updateVendorProfile",protectedRoute,updateVendorProfile)

// Dashboard Data
router.get("/stats", protectedRoute, getVendorStats)
router.get("/services", protectedRoute, getVendorServices)
router.get("/bookings", protectedRoute, getMyVendorBookings)

export default router
