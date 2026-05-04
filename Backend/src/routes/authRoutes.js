import express from "express"
import { checkAuth, login, logout, signup, forgotPassword, resetPassword } from "../controllers/authController.js"
import { protectedRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post('/signup',signup)

router.post('/login',login)

router.post('/logout',logout)

router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)

// router.put('/updateProfilePic',updatePorfilePic)

router.get('/check',protectedRoute,checkAuth)

export default router