import express from "express";
import {
  createClassTimetable,
  getClassTimetable,
  generateTeacherTimetables,
  getTeacherTimetable,
  getClassTimetablesBySchool,
  getStudentTimetable
} from "../controller/timetable.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { isAdmin, isPrincipal, allowRoles } from "../middleware/role.moddleware.js";

const router = express.Router();

router.post("/class", auth, allowRoles("admin", "principal"), createClassTimetable);

router.get("/class/:school_id/:class", auth, getClassTimetable);

router.post("/generate-teachers", auth, allowRoles("admin", "principal"), generateTeacherTimetables);

router.get("/teacher/:teacher_id", auth, getTeacherTimetable);

router.get("/classes/:school_id", auth, getClassTimetablesBySchool);
router.get("/student/:school_id/:class", auth, getStudentTimetable);

export default router;