import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import {
  isPrincipal,
  isTeacher,
  isStudent
} from "../middleware/role.moddleware.js";

import {
  // PRINCIPAL
  getSchoolLessons,
  assignTeacherToLesson,

  // TEACHER
  getTeacherLessons,
  markAttendance,
  updateLessonVideo,

  // COMMON
  getLessonById,

  // STUDENT
  getStudentLessons,
  getAttendancePercentage
} from "../controller/schoolLesson.controller.js";

const router = express.Router();

/**
 * =======================================================
 * PRINCIPAL ROUTES
 * =======================================================
 */

router.get("/", auth, isPrincipal, getSchoolLessons);

router.post("/assign", auth, isPrincipal, assignTeacherToLesson);

/**
 * =======================================================
 * TEACHER ROUTES
 * =======================================================
 */

router.get("/my-lessons", auth, isTeacher, getTeacherLessons);

router.put(
  "/lesson/:lessonId/video",
  auth,
  isTeacher,
  updateLessonVideo
);

router.post(
  "/attendance/mark",
  auth,
  isTeacher,
  markAttendance
);

/**
 * =======================================================
 * STUDENT ROUTES
 * =======================================================
 */

router.get(
  "/student/lessons",
  auth,
  isStudent,
  getStudentLessons
);

router.get(
  "/student/attendance/percentage",
  auth,
  isStudent,
  getAttendancePercentage
);

/**
 * =======================================================
 * COMMON ROUTES (ALL AUTH USERS)
 * =======================================================
 */

router.get(
  "/lesson/:lessonId",
  auth,
  getLessonById
);

export default router;
