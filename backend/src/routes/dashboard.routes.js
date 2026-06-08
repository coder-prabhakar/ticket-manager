import express from "express";

import { getDashboardData, getUserTaskData } from "../controllers/dashboard.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public Routes
router.get("/", authMiddleware, getDashboardData);
router.get("/user", authMiddleware, getUserTaskData);

export default router;