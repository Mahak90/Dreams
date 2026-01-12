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

/**
 * @swagger
 * /marks:
 *   post:
 *     summary: Enter or update student marks
 *     tags: [Marks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject_paper_id
 *               - student_id
 *             properties:
 *               subject_paper_id:
 *                 type: string
 *               student_id:
 *                 type: string
 *               total_marks:
 *                 type: number
 *               grade:
 *                 type: string
 *               component_marks:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Marks entered successfully
 */
router.post("/", auth, isTeacher, enterStudentMarks);

/**
 * @swagger
 * /marks/subject-paper/{subject_paper_id}:
 *   get:
 *     summary: Get marks by subject paper
 *     tags: [Marks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subject_paper_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of marks for the subject paper
 */
router.get("/subject-paper/:subject_paper_id", auth, getMarksBySubjectPaper);

/**
 * @swagger
 * /marks/exam/{exam_id}/student/{student_id}:
 *   get:
 *     summary: Get student marks for exam
 *     tags: [Marks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: exam_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: student_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student marks for the exam
 */
router.get("/exam/:exam_id/student/:student_id", auth, getStudentMarksForExam);

/**
 * @swagger
 * /marks/{id}/lock:
 *   put:
 *     summary: Lock student marks
 *     tags: [Marks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Marks locked successfully
 */
router.put("/:id/lock", auth, isAdmin, lockStudentMarks);

/**
 * @swagger
 * /marks/results/exam/{exam_id}/student/{student_id}:
 *   get:
 *     summary: Calculate and get student results for exam
 *     tags: [Marks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: exam_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: student_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student results for the exam
 */
router.get("/results/exam/:exam_id/student/:student_id", auth, calculateResults);

export default router;