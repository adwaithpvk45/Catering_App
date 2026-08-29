import express from "express";
import { chatWithAssistant, getAdminInsights, getVendorInsights } from "../controllers/aiController.js";
import { protectedRoute, isAdmin, isVendor } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/chat", chatWithAssistant);
router.get("/admin-insights", protectedRoute, isAdmin, getAdminInsights);
router.get("/vendor-insights", protectedRoute, isVendor, getVendorInsights);

export default router;
