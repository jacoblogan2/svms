import express from "express";
import {
  addCategoryController,
  CategoryWithAllController,
  deleteOneCategoryController,
  getOneCategoryController,
  updateOneCategoryController

} from "../controllers/categoriesController.js";

import {
  addressController,

} from "../controllers/addressController.js";// Update the import for the CategoriesController
import { protect } from "../middlewares/protect.js";
import { checkPermission } from "../middlewares/rbac.js";

const router = express.Router();

router.delete("/delete/:id", protect, checkPermission('manage_post_type'), deleteOneCategoryController);
router.post("/add/", protect, checkPermission('manage_post_type'), addCategoryController);
router.get("/", protect, CategoryWithAllController);
router.get("/all", protect, CategoryWithAllController);
router.get("/one/:id", protect, getOneCategoryController);
router.put("/:id", protect, checkPermission('manage_post_type'), updateOneCategoryController);
router.post("/address", protect, addressController);


export default router;

