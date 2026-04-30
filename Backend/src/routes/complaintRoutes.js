import express from "express";
import { createComplaint, getUserComplaints } from "../controllers/complaintController.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Allow anyone to submit complaints/feedback
router.post("/submit", createComplaint);
router.get("/user", protectedRoute, getUserComplaints);

export default router;
