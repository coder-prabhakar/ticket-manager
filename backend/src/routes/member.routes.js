import express from "express";
import { 
    getAllMembers, 
    createMember,
    updateMember,
    deleteMember
} from "../controllers/member.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// Admin Routes
router.get("/", authMiddleware, authorizeRoles("admin"), getAllMembers);
router.post("/", authMiddleware, authorizeRoles("admin"), createMember);
router.put("/:member_id", authMiddleware, authorizeRoles("admin"), updateMember);
router.delete("/:member_id", authMiddleware, authorizeRoles("admin"), deleteMember);

export default router;