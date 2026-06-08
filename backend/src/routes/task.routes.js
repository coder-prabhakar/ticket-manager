import express from "express";
import { 
    getAllTasks, 
    createTask,
    updateTask
} from "../controllers/task.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAllTasks);
router.post("/", authMiddleware, createTask);
router.put("/:id", authMiddleware, updateTask);

export default router;