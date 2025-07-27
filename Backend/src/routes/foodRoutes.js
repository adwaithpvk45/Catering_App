import express from "express"
import { protectedRoute } from "../middleware/auth.middleware.js"
import { addFood,deleteVendorFood,getAllFood, getVendorFood } from "../controllers/foodController.js"
import { uploadFoodImages } from "../utils/multer.js"
import { checkRole } from "../middleware/checkRole.js"


const router = express.Router()

router.delete("/deleteFood/:foodId",protectedRoute,checkRole("vendor"),deleteVendorFood) 
router.post("/addFood",protectedRoute,checkRole("vendor"),uploadFoodImages.single('foodImage'),addFood) // foodImage is the file name in front end wher the file input is present. 
router.get("/getAllFood",protectedRoute,getAllFood)
router.get("/getVendorFood/:vendorId",protectedRoute,getVendorFood)

export default router