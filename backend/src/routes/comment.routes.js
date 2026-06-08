import express from "express";

import { getCommentsByTaskId, createComment } from "../controllers/comment.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:taskId", authMiddleware, getCommentsByTaskId);
router.post("/", authMiddleware, createComment);

export default router;