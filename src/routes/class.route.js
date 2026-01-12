import express from "express";
import {
  addClass,
  getClassesBySchool,
  updateClassSubjects,
  deleteClass
} from "../controller/class.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { isAdmin, isPrincipal } from "../middleware/role.moddleware.js";

const router = express.Router();

/**
 * @swagger
 * /classes:
 *   post:
 *     summary: Add a new class
 *     tags: [Classes]
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
 *               - class_name
 *             properties:
 *               school_id:
 *                 type: string
 *               class_name:
 *                 type: string
 *               subjects:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Class added successfully
 */
router.post("/", auth, isAdmin, addClass);

/**
 * @swagger
 * /classes/school/{school_id}:
 *   get:
 *     summary: Get classes by school
 *     tags: [Classes]
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
 *         description: List of classes
 */
router.get("/school/:school_id", auth, getClassesBySchool);

/**
 * @swagger
 * /classes/{id}/subjects:
 *   put:
 *     summary: Update class subjects
 *     tags: [Classes]
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
 *               - subjects
 *             properties:
 *               subjects:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Class subjects updated successfully
 */
router.put("/:id/subjects", auth, isAdmin, updateClassSubjects);

/**
 * @swagger
 * /classes/{id}:
 *   delete:
 *     summary: Delete class
 *     tags: [Classes]
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
 *         description: Class deleted successfully
 */
router.delete("/:id", auth, isAdmin, deleteClass);

export default router;