// controllers/bookingController.js
import Booking from "../models/bookingModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_T8NDIl1HGYZ4M7",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "QwtLsGRubmsgEE503lTaK9hP",
});
// 1. Create new enquiry
export const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 2. Get bookings for a vendor
export const getBookingsByVendor = async (req, res) => {
  try {
    const bookings = await Booking.find({ vendor: req.params.vendorId }).populate("user","name email profilePic");
    res.json({ success: true, data: bookings,message:"Booking data fetched" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 3. Update booking status (accept/reject)
export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Do not allow status change if the booking is already confirmed, cancelled, or paid
    if (
      booking.paymentStatus === "Advance Paid" ||
      booking.paymentStatus === "Fully Paid" ||
      booking.status === "Confirmed" ||
      booking.status === "Cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot change the status of a confirmed, cancelled, or paid booking",
      });
    }

    booking.status = req.body.status;
    await booking.save();

    res.json({ success: true, data: booking, message: "Status updated successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 4. Get bookings for a specific user
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("vendor", "name profilePic")
      .sort({ createdAt: -1 });
    console.log("getUserBookings backend response payload:", JSON.stringify(bookings, null, 2));
    res.status(200).json({ success: true, bookings, message: "User bookings fetched successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Pay booking advance (customer payment)
export const payBookingAdvance = async (req, res) => {
  try {
    const { paymentId, paidAmount } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    booking.paymentStatus = "Advance Paid";
    booking.status = "Confirmed";
    booking.paymentDetails = {
      paymentId: paymentId || `MOCK-TXN-${Date.now()}`,
      paidAmount: paidAmount || 0,
      paidAt: new Date()
    };
    await booking.save();
    res.status(200).json({ success: true, data: booking, message: "Advance payment recorded successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Mark booking fully paid (vendor/admin payment completion)
export const markBookingFullyPaid = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    booking.paymentStatus = "Fully Paid";
    await booking.save();
    res.status(200).json({ success: true, data: booking, message: "Booking marked as fully paid" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 7. Create Razorpay Order for booking 50% deposit
export const createRazorpayOrder = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    const pricePerHead = booking.services?.[0]?.priceAtBooking || parseFloat(booking.price) || 0;
    const guestCount = booking.guestCount || 0;
    const totalAmount = pricePerHead * guestCount;
    const depositAmount = totalAmount * 0.5;

    // Razorpay amount is in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(depositAmount * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_booking_${booking._id}`,
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID || "rzp_test_T8NDIl1HGYZ4M7"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 8. Verify Razorpay Payment cryptographic signature
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const bookingId = req.params.id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing Razorpay payment parameters" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Cryptographic verification
    const secret = process.env.RAZORPAY_KEY_SECRET || "QwtLsGRubmsgEE503lTaK9hP";
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    if (digest !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Transaction signature verification failed" });
    }

    // Capture success info
    const pricePerHead = booking.services?.[0]?.priceAtBooking || parseFloat(booking.price) || 0;
    const guestCount = booking.guestCount || 0;
    const totalAmount = pricePerHead * guestCount;
    const depositAmount = totalAmount * 0.5;

    booking.paymentStatus = "Advance Paid";
    booking.status = "Confirmed";
    booking.paymentDetails = {
      paymentId: razorpay_payment_id,
      paidAmount: depositAmount,
      paidAt: new Date()
    };

    await booking.save();
    res.status(200).json({ success: true, data: booking, message: "Payment verified and booking confirmed!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
