import express from "express";
import { createBooking, getBookingsByVendor, updateBookingStatus, getUserBookings } from "../controllers/bookingController.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/enquire", createBooking);
router.get("/vendor/:vendorId", getBookingsByVendor);
router.put("/:id", updateBookingStatus);
router.get("/user", protectedRoute, getUserBookings);

export default router;
