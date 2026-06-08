import { hashPassword } from "../utils/hash.js";
import { poolPromise, sql } from "../config/db.js";


// Get All Members
export const getAllCustomers = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool
        .request()
        .input("action", sql.VarChar, "SelectAll")
        .execute("sp_customers");

        const data = result.recordset;

        res.json(data);

    } catch (err) {
        res.status(500).json({ message: "Server error: " + err.message });
    }
};


// Create Member
export const createCustomer = async (req, res) => {
    try {
        let { customer_code, customer_name, password, customer_location, customer_status } = req.body;

        const hashedPassword = await hashPassword(password.trim());

        const pool = await poolPromise;

        const result = await pool
        .request()
        .input("action", sql.VarChar, "Insert")
        .input("customer_code", sql.VarChar, customer_code.trim())
        .input("customer_name", sql.VarChar, customer_name.trim())
        .input("customer_password_hash", sql.VarChar, hashedPassword)
        .input("customer_location", sql.VarChar, customer_location.trim())
        .input("customer_status", sql.Bit, customer_status)
        .execute("sp_customers");

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


// Update Member
export const updateCustomer = async (req, res) => {
    try {
        const { customer_id } = req.params;
        let { customer_code, customer_name, password, customer_location, customer_status } = req.body;

        const pool = await poolPromise;

        let hashedPassword = null;

        // optional password
        if (password && password.trim() !== "") {
            hashedPassword = await hashPassword(password.trim());
        }

        const result = await pool
        .request()
        .input("action", sql.VarChar, "Update")
        .input("customer_id", sql.Int, customer_id)
        .input("customer_code", sql.VarChar, customer_code.trim())
        .input("customer_name", sql.VarChar, customer_name.trim())
        .input("customer_password_hash", sql.VarChar, hashedPassword)
        .input("customer_location", sql.VarChar, customer_location.trim())
        .input("customer_status", sql.Bit, customer_status)
        .execute("sp_customers");

        const data = result.recordset?.[0];

        if (!data || data.Result === '0') {
            return res.status(400).json({ message: data?.Message || "Update failed" });
        }

        res.json({ message: data.Message });

    } catch (err) {
        res.status(500).json({ message: "Server error: " + err.message });
    }
};


// Delete Member
export const deleteCustomer = async (req, res) => {
    try {
        const { customer_id } = req.params;

        const pool = await poolPromise;

        const result = await pool
        .request()
        .input("action", sql.VarChar, "Delete")
        .input("customer_id", sql.Int, customer_id)
        .execute("sp_customers");

        const data = result.recordset?.[0];

        if (!data || data.Result === '0') {
            return res.status(400).json({ message: data?.Message || "Delete failed" });
        }

        res.json({ message: data.Message });

    } catch (err) {
        res.status(500).json({ message: "Server error: " + err.message });
    }
};