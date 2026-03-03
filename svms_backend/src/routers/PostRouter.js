import express from "express";
import {
  addPostController,
  PostWithAllController,
  deleteOnePostController,
  getOnePostController,
  approvePostController,
  rejectPostController,
  addCommentController,
} from "../controllers/PostController.js";

import { protect, optionalProtect } from "../middlewares/protect.js";
import { checkPermission } from "../middlewares/rbac.js";

const router = express.Router();

router.delete("/delete/:id", protect, deleteOnePostController);
router.post("/add/", protect, checkPermission('send_broadcast'), addPostController);
router.get("/", optionalProtect, PostWithAllController);
router.get("/all", protect, PostWithAllController);
router.get("/one/:id", optionalProtect, getOnePostController);
router.put("/approve/:id", protect, checkPermission('approve_request'), approvePostController);
router.put("/reject/:id", protect, checkPermission('reject_request'), rejectPostController);
router.post("/comment",protect, addCommentController);

export default router;

