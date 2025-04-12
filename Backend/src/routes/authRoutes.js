import express from "express"
import { checkAuth, login, logout, signup } from "../controllers/authController.js"
import { protectedRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post('/signup',signup)

router.post('/login',login)

router.post('/logout',logout)

// router.put('/updateProfilePic',updatePorfilePic)

router.get('/check',protectedRoute,checkAuth)

export default router