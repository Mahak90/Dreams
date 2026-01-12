import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.moddleware.js";

import {
  createMasterLesson,
  updateMasterLesson,
  getAllMasterLessons,
  getMasterLessonById,
  getMasterLessonsByClass,
  getMasterLessonsBySubject,
  getMasterLessonsByClassAndSubject,
  getMasterLessonByWeek,
  deleteMasterLesson,
  duplicateMasterLesson
} from "../controller/masterLesson.controller.js";

const router = express.Router();

/**
 * =======================================================
 * ADMIN ONLY
 * =======================================================
 */

/**
 * @swagger
 * /create:
 *   post:
 *     summary: Create master lesson (Admin only)
 *     tags: [Master Lessons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - class
 *               - subject
 *               - week
 *               - lessons
 *             properties:
 *               class:
 *                 type: number
 *                 description: Class number
 *               subject:
 *                 type: string
 *                 description: Subject name
 *               week:
 *                 type: number
 *                 description: Week number
 *               lessons:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     video_link:
 *                       type: string
 *                     lesson_text:
 *                       type: string
 *                     homework:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           question:
 *                             type: string
 *     responses:
 *       201:
 *         description: Master lesson created
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.post("/create", auth, isAdmin, createMasterLesson);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update master lesson (Admin only)
 *     tags: [Master Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Master lesson ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lessons:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     video_link:
 *                       type: string
 *                     lesson_text:
 *                       type: string
 *                     homework:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           question:
 *                             type: string
 *     responses:
 *       200:
 *         description: Master lesson updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Master lesson not found
 *       500:
 *         description: Server error
 */
router.put("/:id", auth, isAdmin, updateMasterLesson);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete master lesson (Admin only)
 *     tags: [Master Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Master lesson ID
 *     responses:
 *       200:
 *         description: Master lesson deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */


router.delete("/:id", auth, isAdmin, deleteMasterLesson);

/**
 * @swagger
 * /{id}/duplicate:
 *   post:
 *     summary: Duplicate master lesson (Admin only)
 *     tags: [Master Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Master lesson ID to duplicate
 *     responses:
 *       200:
 *         description: Master lesson duplicated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.post("/:id/duplicate", auth, isAdmin, duplicateMasterLesson);

/**
 * =======================================================
 * READ (Admin / Principal / Teacher – as needed)
 * =======================================================
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all master lessons
 *     tags: [Master Lessons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all master lessons
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
 *                       class:
 *                         type: number
 *                       subject:
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
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", auth, getAllMasterLessons);

/**
 * @swagger
 * /detail/{id}:
 *   get:
 *     summary: Get master lesson by ID
 *     tags: [Master Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Master lesson ID
 *     responses:
 *       200:
 *         description: Master lesson details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Master lesson not found
 *       500:
 *         description: Server error
 */
router.get("/detail/:id", auth, getMasterLessonById);

/**
 * @swagger
 * /class/{classNo}:
 *   get:
 *     summary: Get master lessons by class
 *     tags: [Master Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classNo
 *         required: true
 *         schema:
 *           type: number
 *         description: Class number
 *     responses:
 *       200:
 *         description: List of master lessons for the class
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/class/:classNo", auth, getMasterLessonsByClass);

/**
 * @swagger
 * /subject/{subject}:
 *   get:
 *     summary: Get master lessons by subject
 *     tags: [Master Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subject
 *         required: true
 *         schema:
 *           type: string
 *         description: Subject name
 *     responses:
 *       200:
 *         description: List of master lessons for the subject
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/subject/:subject", auth, getMasterLessonsBySubject);

/**
 * @swagger
 * /filter:
 *   get:
 *     summary: Get master lessons by class and subject
 *     tags: [Master Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: classNo
 *         schema:
 *           type: number
 *         description: Class number
 *       - in: query
 *         name: subject
 *         schema:
 *           type: string
 *         description: Subject name
 *     responses:
 *       200:
 *         description: List of master lessons filtered by class and subject
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/filter", auth, getMasterLessonsByClassAndSubject);

/**
 * @swagger
 * /week:
 *   get:
 *     summary: Get master lesson by class and week
 *     tags: [Master Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: classNo
 *         schema:
 *           type: number
 *         description: Class number
 *       - in: query
 *         name: week
 *         schema:
 *           type: number
 *         description: Week number
 *     responses:
 *       200:
 *         description: Master lesson for the specified class and week
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/week", auth , getMasterLessonByWeek);

export default router;
