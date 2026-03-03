import express from "express";
import * as familyController from "../controllers/familyMemberController.js";
import protect from "../middlewares/protect.js";
import { checkPermission } from "../middlewares/rbac.js";
import locationScope from "../middlewares/locationScope.js";

const router = express.Router();

router.use(protect);

// Citizen Family Record Management
router.get("/my-family", familyController.getMyFamilyMembers);
router.post("/add", checkPermission("manage_family"), familyController.addFamilyMember);
router.put("/update/:id", checkPermission("manage_family"), familyController.updateMember);
router.delete("/delete/:id", checkPermission("manage_family"), familyController.deleteMember);

// Leader Scoped Households
router.get("/all", checkPermission("view_households"), locationScope, familyController.getScopedFamilyMembers);

export default router;
