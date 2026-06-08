import { hashPassword } from "../utils/hash.js";
import { poolPromise, sql } from "../config/db.js";


// helper → empty string / undefined → NULL
const toNull = (value) => {
    if (value === undefined || value === null || value === "") return null;
    return value.trim();
};


// Get All Members
export const getAllMembers = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool
        .request()
        .input("action", sql.VarChar, "SelectAll")
        .execute("sp_members");

        const data = result.recordset;

        res.json(data);

    } catch (err) {
        res.status(500).json({ message: "Server error: " + err.message });
    }
};


// Create Member
export const createMember = async (req, res) => {
    try {
        let { member_name, member_code, password, member_role, member_phone, member_email, member_status } = req.body;

        const hashedPassword = await hashPassword(password.trim());

        const pool = await poolPromise;

        const result = await pool
        .request()
        .input("action", sql.VarChar, "Insert")
        .input("member_name", sql.VarChar, member_name.trim())
        .input("member_code", sql.VarChar, member_code.trim())
        .input("member_password_hash", sql.VarChar, hashedPassword)
        .input("member_role", sql.VarChar, member_role.trim())
        .input("member_phone", sql.VarChar, toNull(member_phone))
        .input("member_email", sql.VarChar, toNull(member_email))
        .input("member_status", sql.Bit, member_status)
        .execute("sp_members");

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
export const updateMember = async (req, res) => {
    try {
        const { member_id } = req.params;
        let { member_name, member_code, password, member_role, member_phone, member_email, member_status } = req.body;

        const pool = await poolPromise;

        let hashedPassword = null;

        // optional password
        if (password && password.trim() !== "") {
            hashedPassword = await hashPassword(password.trim());
        }

        const result = await pool
        .request()
        .input("action", sql.VarChar, "Update")
        .input("member_id", sql.Int, member_id)
        .input("member_name", sql.VarChar, member_name.trim())
        .input("member_code", sql.VarChar, member_code.trim())
        .input("member_password_hash", sql.VarChar, hashedPassword)
        .input("member_role", sql.VarChar, member_role.trim())
        .input("member_phone", sql.VarChar, toNull(member_phone))
        .input("member_email", sql.VarChar, toNull(member_email))
        .input("member_status", sql.Bit, member_status)
        .execute("sp_members");

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
export const deleteMember = async (req, res) => {
    try {
        const { member_id } = req.params;

        const pool = await poolPromise;

        const result = await pool
        .request()
        .input("action", sql.VarChar, "Delete")
        .input("member_id", sql.Int, member_id)
        .execute("sp_members");

        const data = result.recordset?.[0];

        if (!data || data.Result === '0') {
            return res.status(400).json({ message: data?.Message || "Delete failed" });
        }

        res.json({ message: data.Message });

    } catch (err) {
        res.status(500).json({ message: "Server error: " + err.message });
    }
};