import Complaint from "../models/complaintModel.js";

// Create a new complaint
export const createComplaint = async (req, res) => {
    try {
        const { fullName, email, subject, message } = req.body;
        const userId = req.user ? req.user._id : null; // Optional: handle guest complaints if needed

        if (!fullName || !email || !subject || !message) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const newComplaint = new Complaint({
            userId: userId || req.body.userId, // fallback if not using protected route
            name: fullName,
            email,
            subject,
            message
        });

        await newComplaint.save();

        res.status(201).json({
            success: true,
            message: "Complaint submitted successfully. We will get back to you soon.",
            complaint: newComplaint
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
