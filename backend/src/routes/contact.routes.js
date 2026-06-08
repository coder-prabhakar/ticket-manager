import express from "express";
import { 
    getAllContacts, 
    createContact, 
    updateContact, 
    deleteContact 
} from "../controllers/contact.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, authorizeRoles("admin", "customer"), getAllContacts);
router.post("/", authMiddleware, authorizeRoles("admin", "customer"), createContact);
router.put("/:contact_id", authMiddleware, authorizeRoles("admin", "customer"), updateContact);
router.delete("/:contact_id", authMiddleware, authorizeRoles("admin", "customer"), deleteContact);

export default router;