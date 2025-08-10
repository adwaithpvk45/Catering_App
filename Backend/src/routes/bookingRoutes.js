import express from "express";
import { createBooking, getBookingsByVendor, updateBookingStatus } from "../controllers/bookingController.js";

const router = express.Router();

router.post("/enquire", createBooking);
router.get("/vendor/:vendorId", getBookingsByVendor);
router.patch("/:id", updateBookingStatus);

export default router;
