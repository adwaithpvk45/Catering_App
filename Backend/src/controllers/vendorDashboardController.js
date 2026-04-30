import Booking from "../models/bookingModel.js";
import Service from "../models/serviceModel.js";

// Get stats for Vendor Dashboard
export const getVendorStats = async (req, res) => {
    try {
        const vendorId = req.user._id;

        // Count bookings where this vendor is in the vendor array
        const totalBookings = await Booking.countDocuments({ vendor: vendorId });
        
        // Count services offered by this vendor
        const totalServices = await Service.countDocuments({ vendor: vendorId });

        res.status(200).json({
            success: true,
            stats: {
                totalBookings,
                totalServices
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all services for a specific vendor
export const getVendorServices = async (req, res) => {
    try {
        const vendorId = req.user._id;
        const services = await Service.find({ vendor: vendorId }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, services });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all bookings for a specific vendor (already exists in bookingController, but we can have it here for consistency if needed, or just use the bookingRoutes one. The bookingRoutes has getBookingsByVendor which takes params. We can create one that uses req.user._id for security).
export const getMyVendorBookings = async (req, res) => {
    try {
        const vendorId = req.user._id;
        const bookings = await Booking.find({ vendor: vendorId })
            .populate('user', 'fullName email')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
