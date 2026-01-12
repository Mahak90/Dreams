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

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all school lessons (Principal only)
 *     tags: [School Lessons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of school lessons
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 lessons:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       school_id:
 *                         type: string
 *                       master_id:
 *                         type: string
 *                       class_name:
 *                         type: number
 *                       subject_name:
 *                         type: string
 *                       week:
 *                         type: number
 *                       lessons:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             title:
 *                               type: string
 *                             video_link:
 *                               type: string
 *                             lesson_text:
 *                               type: string
 *                             homework:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   question:
 *                                     type: string
 *                       version:
 *                         type: number
 *                       assigned_teacher_id:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get("/", auth, isPrincipal, getSchoolLessons);

/**
 * @swagger
 * /assign:
 *   post:
 *     summary: Assign teacher to lesson (Principal only)
 *     tags: [School Lessons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - master_id
 *               - teacher_id
 *             properties:
 *               master_id:
 *                 type: string
 *                 description: Master lesson ID
 *               teacher_id:
 *                 type: string
 *                 description: Teacher user ID
 *     responses:
 *       200:
 *         description: Teacher assigned successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.post("/assign", auth, isPrincipal, assignTeacherToLesson);

/**
 * =======================================================
 * TEACHER ROUTES
 * =======================================================
 */

/**
 * @swagger
 * /my-lessons:
 *   get:
 *     summary: Get teacher's assigned lessons (Teacher only)
 *     tags: [School Lessons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of assigned lessons
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get("/my-lessons", auth, isTeacher, getTeacherLessons);

/**
 * @swagger
 * /lesson/{lessonId}/video:
 *   put:
 *     summary: Update lesson video link (Teacher only)
 *     tags: [School Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *         description: Lesson ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - video_link
 *             properties:
 *               video_link:
 *                 type: string
 *                 description: New video link
 *     responses:
 *       200:
 *         description: Video link updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.put(
  "/lesson/:lessonId/video",
  auth,
  isTeacher,
  updateLessonVideo
);

/**
 * @swagger
 * /attendance/mark:
 *   post:
 *     summary: Mark attendance (Teacher only)
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lesson_id
 *               - date
 *               - attendance
 *             properties:
 *               lesson_id:
 *                 type: string
 *                 description: School lesson ID
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Attendance date
 *               attendance:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     student_id:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [present, absent]
 *     responses:
 *       200:
 *         description: Attendance marked
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Lesson not found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /student/lessons:
 *   get:
 *     summary: Get lessons for logged-in student (Student only)
 *     tags: [School Lessons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of student lessons
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get(
  "/student/lessons",
  auth,
  isStudent,
  getStudentLessons
);

/**
 * @swagger
 * /student/attendance/percentage:
 *   get:
 *     summary: Get attendance percentage (Student only)
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Attendance percentage
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 percentage:
 *                   type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /lesson/{lessonId}:
 *   get:
 *     summary: Get lesson by ID (All authenticated users)
 *     tags: [School Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *         description: School lesson ID
 *     responses:
 *       200:
 *         description: Lesson details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lesson not found
 *       500:
 *         description: Server error
 */
router.get(
  "/lesson/:lessonId",
  auth,
  getLessonById
);

export default router;
