import express from "express";
import {
  createLessonPlan,
  getLessonPlans,
  getLessonPlanById,
  updateLessonPlan,
  deleteLessonPlan
} from "../controller/lessonPlan.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { isAdmin, isPrincipal } from "../middleware/role.moddleware.js";

const router = express.Router();

/**
 * @swagger
 * /lesson-plans:
 *   post:
 *     summary: Create a lesson plan
 *     tags: [Lesson Plans]
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
 *               - class
 *               - subject
 *               - week
 *             properties:
 *               school_id:
 *                 type: string
 *               class:
 *                 type: string
 *               subject:
 *                 type: string
 *               week:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 30
 *               video_link:
 *                 type: string
 *               lesson_text:
 *                 type: string
 *               homework_text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lesson plan created successfully
 */
router.post("/", auth, isAdmin, createLessonPlan);

/**
 * @swagger
 * /lesson-plans:
 *   get:
 *     summary: Get lesson plans
 *     tags: [Lesson Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: school_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: class
 *         schema:
 *           type: string
 *       - in: query
 *         name: subject
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of lesson plans
 */
router.get("/", auth, getLessonPlans);

/**
 * @swagger
 * /lesson-plans/{id}:
 *   get:
 *     summary: Get lesson plan by ID
 *     tags: [Lesson Plans]
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
 *         description: Lesson plan details
 */
router.get("/:id", auth, getLessonPlanById);

/**
 * @swagger
 * /lesson-plans/{id}:
 *   put:
 *     summary: Update lesson plan
 *     tags: [Lesson Plans]
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
 *         description: Lesson plan updated successfully
 */
router.put("/:id", auth, updateLessonPlan);

/**
 * @swagger
 * /lesson-plans/{id}:
 *   delete:
 *     summary: Delete lesson plan
 *     tags: [Lesson Plans]
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
 *         description: Lesson plan deleted successfully
 */
router.delete("/:id", auth, deleteLessonPlan);

export default router;