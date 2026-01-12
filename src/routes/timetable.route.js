import express from "express";
import {
  createClassTimetable,
  getClassTimetable,
  generateTeacherTimetables,
  getTeacherTimetable,
  getClassTimetablesBySchool
} from "../controller/timetable.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { isAdmin, isPrincipal } from "../middleware/role.moddleware.js";

const router = express.Router();

/**
 * @swagger
 * /timetables/class:
 *   post:
 *     summary: Create or update class timetable
 *     tags: [Timetables]
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
 *               - periods
 *               - period_slots
 *               - grid
 *             properties:
 *               school_id:
 *                 type: string
 *               class:
 *                 type: string
 *               periods:
 *                 type: integer
 *               period_slots:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     start_time:
 *                       type: string
 *                     end_time:
 *                       type: string
 *               grid:
 *                 type: object
 *     responses:
 *       200:
 *         description: Class timetable created/updated successfully
 */
router.post("/class", auth, isAdmin, createClassTimetable);

/**
 * @swagger
 * /timetables/class/{school_id}/{class}:
 *   get:
 *     summary: Get class timetable
 *     tags: [Timetables]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: school_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: class
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Class timetable details
 */
router.get("/class/:school_id/:class", auth, getClassTimetable);

/**
 * @swagger
 * /timetables/generate-teachers:
 *   post:
 *     summary: Generate teacher timetables
 *     tags: [Timetables]
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
 *             properties:
 *               school_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Teacher timetables generated successfully
 */
router.post("/generate-teachers", auth, isAdmin, generateTeacherTimetables);

/**
 * @swagger
 * /timetables/teacher/{teacher_id}:
 *   get:
 *     summary: Get teacher timetable
 *     tags: [Timetables]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teacher_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Teacher timetable details
 */
router.get("/teacher/:teacher_id", auth, getTeacherTimetable);

/**
 * @swagger
 * /timetables/classes/{school_id}:
 *   get:
 *     summary: Get all class timetables by school
 *     tags: [Timetables]
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
 *         description: List of class timetables
 */
router.get("/classes/:school_id", auth, getClassTimetablesBySchool);

export default router;