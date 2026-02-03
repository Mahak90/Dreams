import express from "express";
import {
  addStudent,
  getStudentsBySchool,
  getMySchoolStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentProfile,
  getStudentSyllabus,
  getStudentAttendance
} from "../controller/student.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { isAdmin, isPrincipal, isStudent, allowRoles } from "../middleware/role.moddleware.js";

const router = express.Router();

router.post("/", auth, allowRoles("admin", "principal", "teacher"), addStudent);
router.get("/", auth, allowRoles("admin", "principal", "teacher"), getMySchoolStudents);

router.get("/school/:school_id", auth, getStudentsBySchool);

router.get("/:id", auth, getStudentById);

router.put("/:id", auth, updateStudent);

router.delete("/:id", auth, deleteStudent);

// STUDENT SELF-SERVICE
router.get("/me/profile", auth, isStudent, getStudentProfile);
router.get("/me/syllabus", auth, isStudent, getStudentSyllabus);
router.get("/me/attendance", auth, isStudent, getStudentAttendance);

export default router;