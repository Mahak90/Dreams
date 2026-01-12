import express from "express";
import {
  createSchool,
  getAllSchools,
  getSchoolById,
  updateSchool,
  deleteSchool
} from "../controller/school.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.moddleware.js";

const router = express.Router();

/**
 * @swagger
 * /schools:
 *   post:
 *     summary: Create a new school
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - school_name
 *               - board
 *               - medium
 *               - city
 *               - state
 *               - principal_name
 *               - principal_number
 *             properties:
 *               school_name:
 *                 type: string
 *               board:
 *                 type: string
 *               medium:
 *                 type: string
 *               number_of_students:
 *                 type: number
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               principal_name:
 *                 type: string
 *               principal_number:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: School created successfully
 */
router.post("/", auth, isAdmin, createSchool);

/**
 * @swagger
 * /schools:
 *   get:
 *     summary: Get all schools
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of schools
 */
router.get("/", auth, isAdmin, getAllSchools);

/**
 * @swagger
 * /schools/{id}:
 *   get:
 *     summary: Get school by ID
 *     tags: [Schools]
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
 *         description: School details
 */
router.get("/:id", auth, getSchoolById);

/**
 * @swagger
 * /schools/{id}:
 *   put:
 *     summary: Update school
 *     tags: [Schools]
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
 *         description: School updated successfully
 */
router.put("/:id", auth, isAdmin, updateSchool);

/**
 * @swagger
 * /schools/{id}:
 *   delete:
 *     summary: Delete school
 *     tags: [Schools]
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
 *         description: School deleted successfully
 */
router.delete("/:id", auth, isAdmin, deleteSchool);

export default router;