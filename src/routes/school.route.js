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

router.post("/", auth, isAdmin, createSchool);

router.get("/", auth, isAdmin, getAllSchools);

router.get("/:id", auth, getSchoolById);

router.put("/:id", auth, isAdmin, updateSchool);

router.delete("/:id", auth, isAdmin, deleteSchool);

export default router;