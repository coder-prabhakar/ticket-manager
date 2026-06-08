import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getInitialData } from "../controllers/initial.controller.js";

const router = express.Router();

// Public Routes
router.get("/", authMiddleware, getInitialData);

export default router;