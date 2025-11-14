import express from "express"
import { getCompanyDashboard, getUserDashboard } from "../controllers/dashboardController.js"
import authorizePermissions from "../middleware/authorizePermissions.js"

const router = express.Router()

router.get("/company", authorizePermissions("company"), getCompanyDashboard)
router.get("/user", authorizePermissions("user"), getUserDashboard)

export default router