import express from "express";
import { createComplaint } from "../controllers/complaintController.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Allow users to submit complaints (protected so we know who they are, but can be optional)
router.post("/submit", protectedRoute, createComplaint);

export default router;
