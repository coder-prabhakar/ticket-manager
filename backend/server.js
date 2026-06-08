import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import authRoutes from "./src/routes/auth.routes.js";
import initialRoutes from "./src/routes/initial.routes.js";
import memberRoutes from "./src/routes/member.routes.js";
import customerRoutes from "./src/routes/customer.routes.js";
import taskRoutes from "./src/routes/task.routes.js";
import commentRoutes from "./src/routes/comment.routes.js";
import reportRoutes from "./src/routes/report.routes.js";
import contactRoutes from "./src/routes/contact.routes.js";
import projectRoutes from "./src/routes/project.routes.js";

dotenv.config();

const app = express();

// Middleware to handle CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    })
);

// Middleware
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/initial", initialRoutes);
app.use("/api/member", memberRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/ticket", taskRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/project", projectRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});