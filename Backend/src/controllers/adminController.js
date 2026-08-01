import User from "../models/userModel.js";
import Vendor from "../models/vendorModel.js";
import Booking from "../models/bookingModel.js";
import Complaint from "../models/complaintModel.js";
import Service from "../models/serviceModel.js";
import { sendComplaintResolvedEmail } from "../utils/email.js";
import { getTicketAnalysis } from "../utils/gemini.js";

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

// Get all users (paginated & searchable)
export const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || "";
        const skip = (page - 1) * limit;

        const query = { role: 'user' };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .select("-password")
            .skip(skip)
            .limit(limit);

        res.status(200).json({ 
            success: true, 
            users,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all vendors (paginated & searchable)
export const getAllVendors = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || "";
        const skip = (page - 1) * limit;

        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const total = await Vendor.countDocuments(query);
        const vendors = await Vendor.find(query)
            .select("-password")
            .skip(skip)
            .limit(limit);

        res.status(200).json({ 
            success: true, 
            vendors,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all bookings (paginated & searchable)
export const getAllBookings = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || "";
        const skip = (page - 1) * limit;

        const query = {};
        if (search) {
            // Match populated user/vendor names if matching search
            const matchingUsers = await User.find({ name: { $regex: search, $options: 'i' } }).select('_id');
            const userIds = matchingUsers.map(u => u._id);

            const matchingVendors = await Vendor.find({ name: { $regex: search, $options: 'i' } }).select('_id');
            const vendorIds = matchingVendors.map(v => v._id);

            query.$or = [
                { user: { $in: userIds } },
                { vendor: { $in: vendorIds } },
                { venueLocation: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
                { eventType: { $regex: search, $options: 'i' } }
            ];
        }

        const total = await Booking.countDocuments(query);
        const bookings = await Booking.find(query)
            .populate('user', 'name email')
            .populate('vendor', 'name email')
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            bookings,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all complaints (paginated & searchable)
export const getAllComplaints = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || "";
        const skip = (page - 1) * limit;

        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const total = await Complaint.countDocuments(query);
        const complaints = await Complaint.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            complaints,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update complaint status
export const updateComplaintStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, replyMessage } = req.body;
        const updatedComplaint = await Complaint.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json({ success: true, updatedComplaint });

        if (status === "Resolved" && updatedComplaint) {
            (async () => {
                try {
                    await sendComplaintResolvedEmail(updatedComplaint, replyMessage);
                } catch (err) {
                    console.error("Non-blocking resolution email error:", err);
                }
            })();
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Block or Unblock a User or Vendor
export const toggleAccountStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // "active" or "blocked"

        if (!["active", "blocked"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value" });
        }

        // Try to update in User collection first
        let account = await User.findByIdAndUpdate(id, { status }, { new: true });
        if (!account) {
            // If not found in User, try Vendor
            account = await Vendor.findByIdAndUpdate(id, { status }, { new: true });
        }

        if (!account) {
            return res.status(404).json({ success: false, message: "Account not found" });
        }

        res.status(200).json({ success: true, message: `Account status updated to ${status}`, account });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Analyze support ticket and draft a reply using AI
export const getAIComplaintAssist = async (req, res) => {
    try {
        const { id } = req.params;
        const complaint = await Complaint.findById(id);
        if (!complaint) {
            return res.status(404).json({ success: false, message: "Complaint not found" });
        }

        const analysis = await getTicketAnalysis(complaint.subject, complaint.message);
        res.status(200).json({ success: true, analysis });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
