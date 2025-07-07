import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/checkRole.js";

import {
  addService,
  getAllService,
  getVendorService,
} from "../controllers/serviceController.js";
import { uploadServiceImages } from "../utils/multer.js";

const router = express.Router();

router.post(
  "/addService",
  protectedRoute,
  checkRole("vendor"),
  uploadServiceImages.single("serviceImage"),
  addService
); // foodImage is the file name in front end wher the file input is present.
router.get("/getAllService", protectedRoute, getAllService);
router.get("/getVendorService/:vendorId", protectedRoute, getVendorService);

export default router;
