import express from "express";
import {
  addStudent,
  getStudentsBySchool,
  getStudentById,
  updateStudent,
  deleteStudent
} from "../controller/student.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { isAdmin, isPrincipal } from "../middleware/role.moddleware.js";

const router = express.Router();

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Add a new student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - class
 *               - school_roll_no
 *               - class_roll_no
 *               - parent_name
 *               - contact_number
 *               - school_id
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               class:
 *                 type: string
 *               school_roll_no:
 *                 type: string
 *               class_roll_no:
 *                 type: string
 *               parent_name:
 *                 type: string
 *               contact_number:
 *                 type: string
 *               age:
 *                 type: number
 *               school_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Student added successfully
 */
router.post("/", auth, isAdmin, addStudent);

/**
 * @swagger
 * /students/school/{school_id}:
 *   get:
 *     summary: Get students by school
 *     tags: [Students]
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
 *         description: List of students
 */
router.get("/school/:school_id", auth, getStudentsBySchool);

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Get student by ID
 *     tags: [Students]
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
 *         description: Student details
 */
router.get("/:id", auth, getStudentById);

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Update student
 *     tags: [Students]
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
 *     responses:
 *       200:
 *         description: Student updated successfully
 */
router.put("/:id", auth, updateStudent);

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Delete student
 *     tags: [Students]
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
 *         description: Student deleted successfully
 */
router.delete("/:id", auth, deleteStudent);

export default router;