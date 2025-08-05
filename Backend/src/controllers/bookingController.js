// controllers/bookingController.js
import Booking from "../models/bookingModel";
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
    const bookings = await Booking.find({ vendor: req.params.vendorId }).populate("user");
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 3. Update booking status (accept/reject)
export const updateBookingStatus = async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
