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

router.post("/", auth, isAdmin, addClass);

router.get("/school/:school_id", auth, getClassesBySchool);

router.put("/:id/subjects", auth, isAdmin, updateClassSubjects);

router.delete("/:id", auth, isAdmin, deleteClass);

export default router;