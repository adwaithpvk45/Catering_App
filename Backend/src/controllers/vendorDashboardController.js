import Booking from "../models/bookingModel.js";
import Service from "../models/serviceModel.js";

// Get stats for Vendor Dashboard
export const getVendorStats = async (req, res) => {
    try {
        const vendorId = req.user._id;

        // Get all bookings for this vendor
        const bookings = await Booking.find({ vendor: vendorId });
        
        const totalBookings = bookings.length;
        const pendingBookings = bookings.filter(b => b.status === "Pending").length;
        const acceptedBookings = bookings.filter(b => b.status === "Accepted").length;
        const cancelledBookings = bookings.filter(b => b.status === "Cancelled").length;
        
        // Count services offered by this vendor
        const totalServices = await Service.countDocuments({ vendor: vendorId });

        // Calculate Revenue (Only for Accepted bookings)
        let totalRevenue = 0;
        bookings.forEach(b => {
            if (b.status === "Accepted" && b.price) {
                // Strip currency symbol and non-numeric characters, then parse to float
                const numericPrice = parseFloat(b.price.replace(/[^\d.]/g, ''));
                if (!isNaN(numericPrice)) {
                    totalRevenue += numericPrice;
                }
            }
        });

        // Group bookings by category
        const categoryMap = {};
        bookings.forEach(b => {
            const cat = b.category || "Uncategorized";
            categoryMap[cat] = (categoryMap[cat] || 0) + 1;
        });
        const categoryStats = Object.keys(categoryMap).map(cat => ({
            category: cat,
            count: categoryMap[cat]
        }));

        // Group by month (last 6 months)
        const monthlyStats = {};
        // Initialize last 6 months with 0
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthName = d.toLocaleString('default', { month: 'short' });
            monthlyStats[monthName] = 0;
        }

        bookings.forEach(b => {
            const date = new Date(b.eventDate || b.createdAt);
            const monthName = date.toLocaleString('default', { month: 'short' });
            if (monthName in monthlyStats) {
                monthlyStats[monthName]++;
            }
        });

        const monthlyBookingTrends = Object.keys(monthlyStats).map(month => ({
            month,
            bookings: monthlyStats[month]
        }));

        res.status(200).json({
            success: true,
            stats: {
                totalBookings,
                pendingBookings,
                acceptedBookings,
                cancelledBookings,
                totalServices,
                totalRevenue,
                categoryStats,
                monthlyBookingTrends
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
