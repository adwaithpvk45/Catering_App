import express from "express";
import { createComplaint } from "../controllers/complaintController.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Allow anyone to submit complaints/feedback
router.post("/submit", createComplaint);

export default router;
