import { poolPromise, sql } from "../config/db.js";


// helper
const toNull = (value) => {
    if (value === undefined || value === null || value === "") {
        return null;
    }
    return value;
};


// ---------------------------------------------------
// Task Report
// ---------------------------------------------------
export const getTaskReport = async (req, res) => {
    try {
        let { role, code } = req.user;
        let { from_date, to_date, task_customer_code, task_assigned_to } = req.body;

        const pool = await poolPromise;

        const result = await pool
            .request()
            .input("from_date", sql.Date, toNull(from_date))
            .input("to_date", sql.Date, toNull(to_date))
            .input("task_customer_code", sql.VarChar, role === "customer" ? code : toNull(task_customer_code))
            .input("task_assigned_to", sql.VarChar, role === "admin" || role === "customer" ? toNull(task_assigned_to) : code)
            .execute("sp_tasks_report");

        res.status(200).json(result.recordset);

    } catch (err) {
        res.status(500).json({ message: "Server error: " + err.message });
    }
};