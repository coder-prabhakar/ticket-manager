import { poolPromise, sql } from "../config/db.js";


export const getTaskReport = async (req, res) => {
    try {
        let { role, code } = req.user;
        let { from_date, to_date, customers, members, task_status } = req.body;

        const toCSV = (val) => {
            if (Array.isArray(val)) return val.length > 0 ? val.join(",") : "all";
            return val || null;
        };

        const pool = await poolPromise;

        const result = await pool
            .request()
            .input("from_date", sql.Date, from_date || null)
            .input("to_date", sql.Date, to_date || null)
            .input("customers", sql.VarChar, role === "customer" ? code : toCSV(customers))
            .input("members", sql.VarChar, role === "admin" || role === "customer" ? toCSV(members) : code)
            .input("task_status", sql.VarChar, toCSV(task_status))
            .execute("sp_tasks_report");

        res.status(200).json(result.recordset);

    } catch (err) {
        res.status(500).json({ message: "Server error: " + err.message });
    }
};