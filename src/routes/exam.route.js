import express from "express";
import {
  createExamType,
  getExamTypesBySchool,
  createExam,
  getExamsBySchool,
  updateExamStatus,
  createSubjectPaper,
  getSubjectPapersByExam,
  lockSubjectPaper
} from "../controller/exam.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { isAdmin, isPrincipal } from "../middleware/role.moddleware.js";

const router = express.Router();

/**
 * @swagger
 * /exams/types:
 *   post:
 *     summary: Create exam type
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - school_id
 *               - name
 *               - default_max_marks
 *               - default_passing_marks
 *             properties:
 *               school_id:
 *                 type: string
 *               name:
 *                 type: string
 *               default_max_marks:
 *                 type: number
 *               default_passing_marks:
 *                 type: number
 *               grading_scale:
 *                 type: string
 *                 enum: [marks, grade, marks_and_grade]
 *     responses:
 *       200:
 *         description: Exam type created successfully
 */
router.post("/types", auth, isAdmin, createExamType);

/**
 * @swagger
 * /exams/types/school/{school_id}:
 *   get:
 *     summary: Get exam types by school
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: school_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of exam types
 */
router.get("/types/school/:school_id", auth, getExamTypesBySchool);

/**
 * @swagger
 * /exams:
 *   post:
 *     summary: Create exam
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - school_id
 *               - academic_year
 *               - exam_name
 *               - exam_type_id
 *               - applicable_classes
 *               - start_date
 *               - end_date
 *             properties:
 *               school_id:
 *                 type: string
 *               academic_year:
 *                 type: string
 *               exam_name:
 *                 type: string
 *               exam_type_id:
 *                 type: string
 *               applicable_classes:
 *                 type: array
 *                 items:
 *                   type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               result_publish_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Exam created successfully
 */
router.post("/", auth, isAdmin, createExam);

/**
 * @swagger
 * /exams/school/{school_id}:
 *   get:
 *     summary: Get exams by school
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: school_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of exams
 */
router.get("/school/:school_id", auth, getExamsBySchool);

/**
 * @swagger
 * /exams/{id}/status:
 *   put:
 *     summary: Update exam status
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [draft, open, locked, published]
 *     responses:
 *       200:
 *         description: Exam status updated successfully
 */
router.put("/:id/status", auth, isAdmin, updateExamStatus);

/**
 * @swagger
 * /exams/subject-papers:
 *   post:
 *     summary: Create subject paper
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - exam_id
 *               - class
 *               - subject
 *               - max_marks
 *               - pass_marks
 *             properties:
 *               exam_id:
 *                 type: string
 *               class:
 *                 type: string
 *               subject:
 *                 type: string
 *               max_marks:
 *                 type: number
 *               pass_marks:
 *                 type: number
 *               assessment_mode:
 *                 type: string
 *                 enum: [marks, grade, marks_and_grade]
 *               components:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Subject paper created successfully
 */
router.post("/subject-papers", auth, isAdmin, createSubjectPaper);

/**
 * @swagger
 * /exams/subject-papers/exam/{exam_id}:
 *   get:
 *     summary: Get subject papers by exam
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: exam_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of subject papers
 */
router.get("/subject-papers/exam/:exam_id", auth, getSubjectPapersByExam);

/**
 * @swagger
 * /exams/subject-papers/{id}/lock:
 *   put:
 *     summary: Lock subject paper
 *     tags: [Exams]
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
 *         description: Subject paper locked successfully
 */
router.put("/subject-papers/:id/lock", auth, isAdmin, lockSubjectPaper);

export default router;