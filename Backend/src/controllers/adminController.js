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

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalVendors,
                totalBookings,
                totalComplaints
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
            .populate('userId', 'fullName email')
            .populate('vendorId', 'vendorName')
            .populate('serviceId', 'serviceName');
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
