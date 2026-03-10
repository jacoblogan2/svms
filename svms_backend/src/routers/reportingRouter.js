import express from "express";
import * as reportingController from "../controllers/reportingController.js";
import { protect } from "../middlewares/protect.js";
import { checkPermission } from "../middlewares/rbac.js";
import locationScope from "../middlewares/locationScope.js";

const router = express.Router();

router.use(protect);

router.post("/generate", checkPermission("create_report"), locationScope, reportingController.generateReport);
router.get("/my", checkPermission("view_reports"), reportingController.getMyReports);
router.get("/all", checkPermission("view_reports"), locationScope, reportingController.getAllReports);
router.get("/received", checkPermission("view_reports"), locationScope, reportingController.getReceivedReports);
// New endpoint specifically for Dashboard stats with time filtering
router.get("/dashboard-stats", checkPermission("view_statistics"), locationScope, reportingController.getDashboardStats);
router.get("/:id", checkPermission("view_reports"), reportingController.getReportDetails);
router.get("/:id/pdf", checkPermission("view_reports"), reportingController.downloadReportPDF);
router.put("/:id/submit", checkPermission("create_report"), reportingController.submitReport);
router.delete("/:id", checkPermission("create_report"), reportingController.deleteReport);

export default router;
