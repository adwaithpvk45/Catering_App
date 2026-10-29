import express from "express";
import { 
    getDashboardStats, 
    getAllUsers, 
    getAllVendors, 
    getAllBookings, 
    getAllComplaints, 
    updateComplaintStatus,
    toggleAccountStatus,
    getAIComplaintAssist
} from "../controllers/adminController.js";
import { protectedRoute, isAdmin } from "../middleware/auth.middleware.js";

import Vendor from "../models/vendorModel.js";
import Booking from "../models/bookingModel.js";

const router = express.Router();

// Map distribution endpoint for rendering caterer pins (safe public vendor info)
router.get("/vendors-distribution", async (req, res) => {
    try {
        const vendors = await Vendor.find({})
            .select("name email phone location coordinates status profilePic Services foodItems")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, vendors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Comprehensive Demand vs Supply distribution endpoint
router.get("/demand-supply-distribution", async (req, res) => {
    try {
        const [vendors, bookings] = await Promise.all([
            Vendor.find({}).select("name email phone location coordinates status profilePic"),
            Booking.find({}).select("venueLocation guestCount price category status eventDate coordinates")
        ]);

        // Format demand points with normalized intensity for heatmap
        const demandPoints = bookings.map(b => {
            const guests = Number(b.guestCount) || 50;
            // Intensity between 0.3 and 1.0 based on guest count scale (50 to 500 guests)
            const intensity = Math.min(1.0, Math.max(0.3, parseFloat((guests / 300).toFixed(2))));
            return {
                _id: b._id,
                venueLocation: b.venueLocation,
                guestCount: guests,
                category: b.category,
                price: b.price,
                status: b.status,
                eventDate: b.eventDate,
                coordinates: b.coordinates || { lat: 0, lng: 0 },
                intensity
            };
        }).filter(dp => dp.coordinates && (dp.coordinates.lat !== 0 || dp.coordinates.lng !== 0));

        // Regional market analytics (Demand vs Supply)
        const keyHubs = ["Kochi", "Thrissur", "Calicut", "Trivandrum", "Kannur", "Kakkanad", "Aluva", "Kollam", "Palakkad", "Kottayam"];
        const hubStats = keyHubs.map(hubName => {
            const hubLower = hubName.toLowerCase();
            const supplyCount = vendors.filter(v => (v.location || "").toLowerCase().includes(hubLower)).length;
            const demandCount = bookings.filter(b => (b.venueLocation || "").toLowerCase().includes(hubLower)).length;
            const totalGuests = bookings
                .filter(b => (b.venueLocation || "").toLowerCase().includes(hubLower))
                .reduce((acc, curr) => acc + (Number(curr.guestCount) || 0), 0);

            return {
                hub: hubName,
                supply: supplyCount,
                demand: demandCount,
                totalGuests,
                isOpportunity: demandCount > supplyCount
            };
        });

        // Identify underserved opportunity zones
        const opportunityZones = hubStats.filter(h => h.isOpportunity || (h.demand > 0 && h.supply <= 1));

        res.status(200).json({
            success: true,
            vendors,
            demandPoints,
            summary: {
                totalCaterers: vendors.length,
                totalBookings: bookings.length,
                mappedDemandPoints: demandPoints.length,
                hubStats,
                opportunityZones
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// All following admin routes are protected and restricted to admins
router.use(protectedRoute, isAdmin);

router.get("/stats", getDashboardStats);
router.get("/users", getAllUsers);
router.get("/vendors", getAllVendors);
router.get("/bookings", getAllBookings);
router.get("/complaints", getAllComplaints);
router.patch("/complaints/:id", updateComplaintStatus);
router.patch("/status/:id", toggleAccountStatus);
router.post("/complaints/:id/ai-assist", getAIComplaintAssist);

export default router;
