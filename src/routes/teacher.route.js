import express from "express";
import {
  addTeacher,
  getTeachersBySchool,
  getTeacherById,
  updateTeacher,
  deleteTeacher
} from "../controller/teacher.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { isAdmin, isPrincipal } from "../middleware/role.moddleware.js";

const router = express.Router();

/**
 * @swagger
 * /teachers:
 *   post:
 *     summary: Add a new teacher
 *     tags: [Teachers]
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
 *               - classes
 *               - subjects
 *               - school_id
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               classes:
 *                 type: array
 *                 items:
 *                   type: string
 *               subjects:
 *                 type: array
 *                 items:
 *                   type: string
 *               is_class_teacher:
 *                 type: boolean
 *               class_teacher_for:
 *                 type: string
 *               school_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Teacher added successfully
 */
router.post("/", auth, isAdmin, addTeacher);

/**
 * @swagger
 * /teachers/school/{school_id}:
 *   get:
 *     summary: Get teachers by school
 *     tags: [Teachers]
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
 *         description: List of teachers
 */
router.get("/school/:school_id", auth, getTeachersBySchool);

/**
 * @swagger
 * /teachers/{id}:
 *   get:
 *     summary: Get teacher by ID
 *     tags: [Teachers]
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
 *         description: Teacher details
 */
router.get("/:id", auth, getTeacherById);

/**
 * @swagger
 * /teachers/{id}:
 *   put:
 *     summary: Update teacher
 *     tags: [Teachers]
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
 *         description: Teacher updated successfully
 */
router.put("/:id", auth, updateTeacher);

/**
 * @swagger
 * /teachers/{id}:
 *   delete:
 *     summary: Delete teacher
 *     tags: [Teachers]
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
 *         description: Teacher deleted successfully
 */
router.delete("/:id", auth, deleteTeacher);

export default router;