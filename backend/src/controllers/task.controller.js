import { poolPromise, sql } from "../config/db.js";


// ---------------------------------------------------
// Get All Tasks
// ---------------------------------------------------
export const getAllTasks = async (req, res) => {
    try {
        const { role, code } = req.user;
        const pool = await poolPromise;

        const result = await pool
            .request()
            .input("action", sql.VarChar, "SelectAll")
            .input("role", sql.VarChar, role)
            .input("code", sql.VarChar, code)
            .execute("sp_tasks");

        res.json(result.recordset);

    } catch (err) {
        res.status(500).json({ message: "Server error: " + err.message });
    }
};


// ---------------------------------------------------
// Create Task
// ---------------------------------------------------
export const createTask = async (req, res) => {
    try {
        const { role, code } = req.user;

        let {
            task_title,
            task_description,
            task_customer_code,
            task_project_id,
            task_assigned_to,
            created_at,
            task_deadline,
            completed_at,
            task_status
        } = req.body;

        // Array ko comma-separated string me convert karna
        const assigned_to_string = Array.isArray(task_assigned_to) 
            ? [...task_assigned_to].sort().join(',') 
            : (task_assigned_to || null);

        const pool = await poolPromise;

        const result = await pool
            .request()
            .input("action", sql.VarChar, "Insert")
            .input("task_title", sql.VarChar, task_title)
            .input("task_description", sql.VarChar, task_description ?? null)
            .input("task_customer_code", sql.VarChar, role === "customer" ? code : task_customer_code)
            .input("task_project_id", sql.Int, task_project_id ?? null)
            .input("task_assigned_to", sql.VarChar(sql.MAX), assigned_to_string)
            .input("created_at", sql.Date, created_at)
            .input("task_deadline", sql.Date, task_deadline ?? null)
            .input("completed_at", sql.Date, completed_at ?? null)
            .input("task_status", sql.VarChar, task_status)
            .input("created_by", sql.VarChar, code)
            .execute("sp_tasks");

        const data = result.recordset?.[0];

        if (!data || data.Result === '0') {
            return res.status(400).json({ message: data?.Message || "Insert failed" });
        }

        res.status(201).json({ message: data.Message });

    } catch (err) {
        res.status(500).json({ message: "Server error: " + err.message });
    }
};


// ---------------------------------------------------
// Update Task (Assign / Deadline / Status)
// ---------------------------------------------------
export const updateTask = async (req, res) => {
    try {
        const { role, code } = req.user;
        const { id } = req.params;

        let {
            task_title,
            task_description,
            task_customer_code,
            task_project_id,
            task_assigned_to,
            created_at,
            task_deadline,
            completed_at,
            task_status
        } = req.body;

        // Array ko comma-separated string me convert karna
        const assigned_to_string = Array.isArray(task_assigned_to) 
            ? [...task_assigned_to].sort().join(',') 
            : (task_assigned_to || null);

        const pool = await poolPromise;

        const result = await pool
            .request()
            .input("action", sql.VarChar, "Update")
            .input("task_id", sql.Int, id)
            .input("task_title", sql.VarChar, task_title)
            .input("task_description", sql.VarChar, task_description ?? null)
            .input("task_customer_code", sql.VarChar, role === "customer" ? code : task_customer_code)
            .input("task_project_id", sql.Int, task_project_id ?? null)
            .input("task_assigned_to", sql.VarChar(sql.MAX), assigned_to_string)
            .input("created_at", sql.Date, created_at)
            .input("task_deadline", sql.Date, task_deadline ?? null)
            .input("completed_at", sql.Date, completed_at ?? null)
            .input("task_status", sql.VarChar, task_status)
            .execute("sp_tasks");

        const data = result.recordset?.[0];

        if (!data || data.Result === '0') {
            return res.status(400).json({ message: data?.Message || "Update failed" });
        }

        res.json({ message: data.Message });

    } catch (err) {
        res.status(500).json({ message: "Server error: " + err.message });
    }
};