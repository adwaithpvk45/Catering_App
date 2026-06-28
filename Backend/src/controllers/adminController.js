import User from "../models/userModel.js";
import Vendor from "../models/vendorModel.js";
import Booking from "../models/bookingModel.js";
import Complaint from "../models/complaintModel.js";
import Service from "../models/serviceModel.js";

// Get overall stats for Admin Dashboard
export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalVendors = await Vendor.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const totalComplaints = await Complaint.countDocuments({ status: 'Pending' });

        // Get all bookings to calculate trends and distribution
        const bookings = await Booking.find();

        // 1. Group bookings by category for all bookings
        const categoryMap = {};
        bookings.forEach(b => {
            const cat = b.category || "Others";
            categoryMap[cat] = (categoryMap[cat] || 0) + 1;
        });
        const categoryStats = Object.keys(categoryMap).map(cat => ({
            name: cat,
            value: categoryMap[cat]
        }));

        // 2. Group by month (last 6 months) for all bookings
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
                totalUsers,
                totalVendors,
                totalBookings,
                totalComplaints,
                categoryStats,
                monthlyBookingTrends
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select("-password");
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all vendors
export const getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate('userId', 'fullName email profilePic');
        res.status(200).json({ success: true, vendors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all bookings
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email')
            .populate('vendor', 'name email');
        res.status(200).json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all complaints
export const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, complaints });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update complaint status
export const updateComplaintStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedComplaint = await Complaint.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json({ success: true, updatedComplaint });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
