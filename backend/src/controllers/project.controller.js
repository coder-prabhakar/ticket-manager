import { poolPromise, sql } from "../config/db.js";


// ---------------------------------------------------
// Get All Projects
// ---------------------------------------------------
export const getAllProjects = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool
            .request()
            .input("action", sql.VarChar, "SelectAll")
            .execute("sp_customer_projects");

        res.json(result.recordset);

    } catch (err) {
        res.status(500).json({ message: "Server error: " + err.message });
    }
};


// ---------------------------------------------------
// Create Project
// ---------------------------------------------------
export const createProject = async (req, res) => {
    try {
        const { code } = req.user;
        let { project_name, customer_code, project_status } = req.body;

        const pool = await poolPromise;

        const result = await pool
        .request()
        .input("action", sql.VarChar, "Insert")
        .input("project_name", sql.VarChar, project_name.trim())
        .input("customer_code", sql.VarChar, customer_code.trim())
        .input("project_status", sql.Bit, project_status)
        .input("created_by", sql.VarChar, code)
        .execute("sp_customer_projects");

        const data = result.recordset?.[0];

        if (!data || data.Result === '0') {
            return res.status(400).json({ message: data?.Message || "Insert failed" });
        }

        res.status(201).json({
            message: data.Message,
        });

    } catch (err) {
        res.status(500).json({ message: "Server error: " + err.message });
    }
};


// ---------------------------------------------------
// Update Project
// ---------------------------------------------------
export const updateProject = async (req, res) => {
    try {
        const { project_id } = req.params;
        let { project_name, customer_code, project_status } = req.body;

        const pool = await poolPromise;

        const result = await pool
        .request()
        .input("action", sql.VarChar, "Update")
        .input("project_id", sql.Int, project_id)
        .input("project_name", sql.VarChar, project_name.trim())
        .input("customer_code", sql.VarChar, customer_code.trim())
        .input("project_status", sql.Bit, project_status)
        .execute("sp_customer_projects");

        const data = result.recordset?.[0];

        if (!data || data.Result === '0') {
            return res.status(400).json({ message: data?.Message || "Update failed" });
        }

        res.json({ message: data.Message });

    } catch (err) {
        res.status(500).json({ message: "Server error: " + err.message });
    }
};


// ---------------------------------------------------
// Delete Project
// ---------------------------------------------------
export const deleteProject = async (req, res) => {
    try {
        const { project_id } = req.params;

        const pool = await poolPromise;

        const result = await pool
        .request()
        .input("action", sql.VarChar, "Delete")
        .input("project_id", sql.Int, project_id)
        .execute("sp_customer_projects");

        const data = result.recordset?.[0];

        if (!data || data.Result === '0') {
            return res.status(400).json({ message: data?.Message || "Delete failed" });
        }

        res.json({ message: data.Message });

    } catch (err) {
        res.status(500).json({ message: "Server error: " + err.message });
    }
};