import { poolPromise, sql } from "../config/db.js";

// ---------------------------------------------------
// Get Dashboard Data
// ---------------------------------------------------
export const getDashboardData = async (req, res) => {
    try {
        const { role, code } = req.user;

        const pool = await poolPromise;

        const result = await pool
        .request()
        .input("role", sql.VarChar(100), role)
        .input("code", sql.VarChar(50), code)
        .execute("sp_Dashboard");

        const data = result.recordsets;

        return res.json(data);

    } catch (err) {
        res.status(500).json({ message: "Server error: " + err.message });
    }
};

// ---------------------------------------------------
// Get User Task Data
// ---------------------------------------------------
export const getUserTaskData = async (req, res) => {
    try {
        const { role, code } = req.query;

        const pool = await poolPromise;

        const result = await pool
            .request()
            .input("action", sql.VarChar, "SelectByUser")
            .input("role", sql.VarChar, role)
            .input("code", sql.VarChar, code)
            .execute("sp_tasks");

        res.json(result.recordset);

    } catch (err) {
        res.status(500).json({ message: "Server error: " + err.message });
    }
};