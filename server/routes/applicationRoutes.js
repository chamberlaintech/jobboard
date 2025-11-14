import express from "express";
import upload from "../middleware/upload.js";
import { createApplication, getCompanyApplications, getMyApplications, updateApplications, deleteApplications } from "../controllers/applicationController.js"
import authorizePermissions from "../middleware/authorizePermissions.js";

const router = express.Router();

router.route("/").post(authorizePermissions("user"), upload.single("resume"), createApplication);
router.route("/my").get(authorizePermissions("user"), getMyApplications)
router.route("/company").get(authorizePermissions("company"), getCompanyApplications)
router.route("/:id").delete(authorizePermissions("user"), deleteApplications)
router.route("/:id/status").patch(authorizePermissions("company"), updateApplications)

export default router