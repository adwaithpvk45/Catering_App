import express from "express"
import { protectedRoute } from "../middleware/auth.middleware.js"
import { addFood,getFood } from "../controllers/foodController.js"
import { uploadFoodImages } from "../utils/multer.js"
import { checkRole } from "../middleware/checkRole.js"


const router = express.Router()

router.post("/addFood",protectedRoute,checkRole("vendor"),uploadFoodImages.single('foodImage'),addFood) // foodImage is the file name in front end wher the file input is present. 
router.get("/getFood",protectedRoute,getFood)

export default router