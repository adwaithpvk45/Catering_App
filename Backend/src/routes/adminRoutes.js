import express from "express";
import { 
    getDashboardStats, 
    getAllUsers, 
    getAllVendors, 
    getAllBookings, 
    getAllComplaints, 
    updateComplaintStatus 
} from "../controllers/adminController.js";
import { protectedRoute, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// All admin routes should be protected and restricted to admins
router.use(protectedRoute, isAdmin);

router.get("/stats", getDashboardStats);
router.get("/users", getAllUsers);
router.get("/vendors", getAllVendors);
router.get("/bookings", getAllBookings);
router.get("/complaints", getAllComplaints);
router.patch("/complaints/:id", updateComplaintStatus);

export default router;
