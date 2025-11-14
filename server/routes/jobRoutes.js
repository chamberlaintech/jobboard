import express from "express";
import { getAllJobs, getJob, createJob, updateJob, deleteJob } from "../controllers/jobController.js";
import authorizePermissions from "../middleware/authorizePermissions.js";
import authenticateUser from "../middleware/auth.js"

const router = express.Router();


router.route("/").get(getAllJobs).post(authenticateUser, authorizePermissions("company"), createJob);
router.route("/:id").get(getJob).patch(authenticateUser, authorizePermissions("company"), updateJob).delete(authenticateUser, authorizePermissions("company"), deleteJob);

export default router;