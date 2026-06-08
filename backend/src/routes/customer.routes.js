import express from "express";

import { 
    getAllCustomers, 
    createCustomer, 
    updateCustomer, 
    deleteCustomer 
} from "../controllers/customer.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// Admin Routes
router.get("/", authMiddleware, authorizeRoles("admin"), getAllCustomers);
router.post("/", authMiddleware, authorizeRoles("admin"), createCustomer);
router.put("/:customer_id", authMiddleware, authorizeRoles("admin"), updateCustomer);
router.delete("/:customer_id", authMiddleware, authorizeRoles("admin"), deleteCustomer);

export default router;