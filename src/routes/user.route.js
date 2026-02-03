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

router.post("/register", register);

router.post("/register/admin", register);

router.post("/login", login);

router.get("/refresh-token", refreshAccessToken);

router.post("/logout", auth, logout);

router.get("/me", auth, getMyProfile);

/**
 * =======================================================
 * ADMIN ROUTES
 * =======================================================
 */

router.get("/users", auth, isAdmin, getUsersByRole);

router.put("/users/:id", auth, isAdmin, updateUser);

router.delete("/users/:id", auth, isAdmin, deleteUser);

/**
 * =======================================================
 * PRINCIPAL ROUTES
 * =======================================================
 */

router.get(
  "/school/users",
  auth,
  isPrincipal,
  getUsersBySchool
);

export default router; 
