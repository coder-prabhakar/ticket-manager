import express from "express";

import { getTaskReport } from "../controllers/report.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, getTaskReport);

export default router;