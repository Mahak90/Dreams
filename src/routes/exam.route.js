import express from "express";
import {
  createExamType,
  getExamTypesBySchool,
  createExam,
  getExamsBySchool,
  getAllExams,
  updateExamStatus,
  createSubjectPaper,
  getSubjectPapersByExam,
  lockSubjectPaper
} from "../controller/exam.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { isAdmin, isPrincipal } from "../middleware/role.moddleware.js";

const router = express.Router();

router.post("/types", auth, isAdmin, createExamType);

router.get("/types/school/:school_id", auth, getExamTypesBySchool);

router.post("/", auth, isAdmin, createExam);

router.get("/school/:school_id", auth, getExamsBySchool);

router.get("/all", auth, isAdmin, getAllExams);

router.put("/:id/status", auth, isAdmin, updateExamStatus);

router.post("/subject-papers", auth, isAdmin, createSubjectPaper);

router.get("/subject-papers/exam/:exam_id", auth, getSubjectPapersByExam);

router.put("/subject-papers/:id/lock", auth, isAdmin, lockSubjectPaper);

export default router;