import { poolPromise, sql } from "../config/db.js";


export const getInitialData = async (req, res) => {
    try {
        const { role, code } = req.user;
        const { fromDate, toDate } = req.query;

        const pool = await poolPromise;

        const result = await pool
        .request()
        .input("role", sql.VarChar, role)
        .input("code", sql.VarChar, code)
        .input("fromDate", sql.Date, fromDate || null)
        .input("toDate", sql.Date, toDate || null)
        .execute("sp_initial_data");

        const data = result.recordset[0];

        const response = {
            DashboardStats: JSON.parse(data.DashboardStats || "{}"),
            CustomersForDDL: JSON.parse(data.CustomersForDDL || "[]"),
            MembersForDDL: JSON.parse(data.MembersForDDL || "[]"),
            ProjectsForDDL: JSON.parse(data.ProjectsForDDL || "[]")
        };

        return res.json(response);

    } catch (err) {
        res.status(500).json({ message: "Server error: " + err.message });
    }
};