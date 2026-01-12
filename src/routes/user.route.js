import express from "express";
import {
  register,
  login,
  refreshAccessToken,
  logout,
  getMyProfile,
  getUsersByRole,
  getUsersBySchool,
  updateUser,
  deleteUser
} from "../controller/user.controller.js";

import { auth } from "../middleware/auth.middleware.js";
import {
  isAdmin,
  isPrincipal
} from "../middleware/role.moddleware.js";

const router = express.Router();

/**
 * 
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Admin can add Principal, Principal can add Teacher/Student
 *     tags: [Auth]
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
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, principal, teacher, student]
 *               school_id:
 *                 type: string
 *               classes:
 *                 type: array
 *                 items:
 *                   type: number
 *               subjects:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Email already exists
 *       500:
 *         description: Server error
 */
router.post("/register",  register);

router.post("/register/admin", register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 accessToken:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     role:
 *                       type: string
 *                     school_id:
 *                       type: string
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/login", login);

/**
 * @swagger
 * /refresh-token:
 *   get:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: New access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Token expired or invalid
 *       403:
 *         description: No refresh token or invalid
 */
router.get("/refresh-token", refreshAccessToken);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       500:
 *         description: Server error
 */
router.post("/logout", auth, logout);

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get my profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     school_id:
 *                       type: string
 *                     classes:
 *                       type: array
 *                       items:
 *                         type: number
 *                     subjects:
 *                       type: array
 *                       items:
 *                         type: string
 */
router.get("/me", auth, getMyProfile);

/**
 * =======================================================
 * ADMIN ROUTES
 * =======================================================
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get users by role (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, principal, teacher, student]
 *         description: User role to filter by
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *                       school_id:
 *                         type: string
 *                       classes:
 *                         type: array
 *                         items:
 *                           type: number
 *                       subjects:
 *                         type: array
 *                         items:
 *                           type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/", auth, isAdmin, getUsersByRole);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update user (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *               school_id:
 *                 type: string
 *               classes:
 *                 type: array
 *                 items:
 *                   type: number
 *               subjects:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: User updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.put("/:id", auth, isAdmin, updateUser);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete user (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.delete("/:id", auth, isAdmin, deleteUser);

/**
 * =======================================================
 * PRINCIPAL ROUTES
 * =======================================================
 */

/**
 * @swagger
 * /school/users:
 *   get:
 *     summary: Get all users of same school (Principal only)
 *     tags: [Principal]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users in the school
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *                       school_id:
 *                         type: string
 *                       classes:
 *                         type: array
 *                         items:
 *                           type: number
 *                       subjects:
 *                         type: array
 *                         items:
 *                           type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/school/users",
  auth,
  isPrincipal,
  getUsersBySchool
);

export default router; 
