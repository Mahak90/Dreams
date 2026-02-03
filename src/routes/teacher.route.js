import express from "express";
import {
  addTeacher,
  getTeachersBySchool,
  getMySchoolTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  getTeacherProfile
} from "../controller/teacher.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { isAdmin, isPrincipal, allowRoles } from "../middleware/role.moddleware.js";

const router = express.Router();

router.post("/", auth, allowRoles("admin", "principal"), addTeacher);
router.get("/", auth, allowRoles("admin", "principal"), getMySchoolTeachers);
router.get("/profile", auth, allowRoles("teacher"), getTeacherProfile);

router.get("/school/:school_id", auth, getTeachersBySchool);

router.get("/:id", auth, getTeacherById);

router.put("/:id", auth, updateTeacher);

router.delete("/:id", auth, deleteTeacher);

export default router;