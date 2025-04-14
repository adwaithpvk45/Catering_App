import express from "express";
import { protectedRoute } from "../middleware/auth.middleware";
import { addService, getAllService, getVendorService } from "../controllers/serviceController";
import { uploadServiceImages } from "../utils/multer";

const router = express.Router()

router.post("/addService",protectedRoute,checkRole("vendor"),uploadServiceImages.single('serviceImage'),addService) // foodImage is the file name in front end wher the file input is present. 
router.get("/getAllService",protectedRoute,getAllService)
router.get("/getVendorService/:vendorId",protectedRoute,getVendorService)

export default router