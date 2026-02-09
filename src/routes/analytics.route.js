import express from "express";
import { getGlobalAnalytics } from "../controller/analytics.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.moddleware.js";

const router = express.Router();

router.get("/global", auth, isAdmin, getGlobalAnalytics);

export default router;
