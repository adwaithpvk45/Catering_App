import express from "express";
import { 
  createBooking, 
  getBookingsByVendor, 
  updateBookingStatus, 
  getUserBookings, 
  payBookingAdvance, 
  markBookingFullyPaid,
  createRazorpayOrder,
  verifyRazorpayPayment
} from "../controllers/bookingController.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/enquire", createBooking);
router.get("/vendor/:vendorId", getBookingsByVendor);
router.put("/:id", updateBookingStatus);
router.get("/user", protectedRoute, getUserBookings);
router.patch("/:id/pay-advance", protectedRoute, payBookingAdvance);
router.patch("/:id/mark-fully-paid", protectedRoute, markBookingFullyPaid);
router.post("/:id/razorpay-order", protectedRoute, createRazorpayOrder);
router.post("/:id/verify-payment", protectedRoute, verifyRazorpayPayment);

export default router;
