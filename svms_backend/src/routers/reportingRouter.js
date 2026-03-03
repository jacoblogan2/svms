import express from "express";
import * as reportingController from "../controllers/reportingController.js";
import protect from "../middlewares/protect.js";
import { checkPermission } from "../middlewares/rbac.js";
import locationScope from "../middlewares/locationScope.js";

const router = express.Router();

router.use(protect);

router.post("/generate", checkPermission("create_report"), locationScope, reportingController.generateReport);
router.get("/my", checkPermission("view_reports"), reportingController.getMyReports);
router.get("/all", checkPermission("view_reports"), locationScope, reportingController.getAllReports);
router.get("/:id", checkPermission("view_reports"), reportingController.getReportDetails);

export default router;
