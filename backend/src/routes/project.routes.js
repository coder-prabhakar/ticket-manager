import express from "express";
import { 
    getAllProjects, 
    createProject, 
    updateProject, 
    deleteProject 
} from "../controllers/project.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, authorizeRoles("admin"), getAllProjects);
router.post("/", authMiddleware, authorizeRoles("admin"), createProject);
router.put("/:project_id", authMiddleware, authorizeRoles("admin"), updateProject);
router.delete("/:project_id", authMiddleware, authorizeRoles("admin"), deleteProject);

export default router;