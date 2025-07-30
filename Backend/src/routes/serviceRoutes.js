import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/checkRole.js";

import {
  addService,
  deleteVendorService,
  editService,
  getAllService,
  getVendorService,
} from "../controllers/serviceController.js";
import { uploadServiceImages } from "../utils/multer.js";
import { deleteVendorFood } from "../controllers/foodController.js";

const router = express.Router();
router.put(
  "/editService/:serviceId",
  protectedRoute,
  checkRole("vendor"),
  uploadServiceImages.single("foodImage"),
  editService
); // foodImage is the file name in front end wher the file input is present.

router.post(
  "/addService",
  protectedRoute,
  checkRole("vendor"),
  uploadServiceImages.single("serviceImage"),
  addService
); // foodImage is the file name in front end wher the file input is present.
router.get("/getAllService", protectedRoute, getAllService);
router.get("/getVendorService/:vendorId", protectedRoute, getVendorService);
router.delete(
  "/deleteService/:serviceId",
  protectedRoute,
  checkRole("vendor"),
  deleteVendorService
);

export default router;
