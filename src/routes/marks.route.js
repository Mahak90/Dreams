import express from "express";
import {
  enterStudentMarks,
  getMarksBySubjectPaper,
  getStudentMarksForExam,
  lockStudentMarks,
  calculateResults
} from "../controller/marks.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { isAdmin, isPrincipal, isTeacher } from "../middleware/role.moddleware.js";

const router = express.Router();

router.post("/", auth, isTeacher, enterStudentMarks);

router.get("/subject-paper/:subject_paper_id", auth, getMarksBySubjectPaper);

router.get("/exam/:exam_id/student/:student_id", auth, getStudentMarksForExam);

router.put("/:id/lock", auth, isAdmin, lockStudentMarks);

router.get("/results/exam/:exam_id/student/:student_id", auth, calculateResults);

export default router;