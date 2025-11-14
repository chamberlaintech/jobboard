import express from "express"
import { login, register, updateProfile, updatePassword } from "../controllers/authController.js"
import auth from "../middleware/auth.js"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.patch("/profile", auth, updateProfile)
router.patch("/password", auth, updatePassword)

export default router