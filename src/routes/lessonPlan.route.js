import express from "express";
import {
  createLessonPlan,
  getLessonPlans,
  getLessonPlanById,
  updateLessonPlan,
  deleteLessonPlan
} from "../controller/lessonPlan.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { isAdmin, isPrincipal } from "../middleware/role.moddleware.js";

const router = express.Router();

router.post("/", auth, isAdmin, createLessonPlan);

router.get("/", auth, getLessonPlans);

router.get("/:id", auth, getLessonPlanById);

router.put("/:id", auth, updateLessonPlan);

router.delete("/:id", auth, deleteLessonPlan);

export default router;