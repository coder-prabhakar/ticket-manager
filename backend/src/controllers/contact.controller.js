import { poolPromise, sql } from "../config/db.js";


// helper → empty string / undefined → NULL
const toNull = (value) => {
    if (value === undefined || value === null || value === "") return null;
    return value;
};


// ---------------------------------------------------
// Get All Contacts
// ---------------------------------------------------
export const getAllContacts = async (req, res) => {
    try {
        const { role, code } = req.user;
        const pool = await poolPromise;

        const result = await pool
            .request()
            .input("action", sql.VarChar, "SelectAll")
            .input("role", sql.VarChar, role)
            .input("code", sql.VarChar, code)
            .execute("sp_customer_contacts");

        res.json(result.recordset);

    } catch (err) {
        res.status(500).json({ message: "Server error: " + err.message });
    }
};


// ---------------------------------------------------
// Create Contact
// ---------------------------------------------------
export const createContact = async (req, res) => {
    try {
        const { role, code } = req.user;
        let { customer_code, contact_person_name, contact_phone, contact_email } = req.body;

        const pool = await poolPromise;

        const result = await pool
        .request()
        .input("action", sql.VarChar, "Insert")
        .input("customer_code", sql.VarChar, role === "customer" ? code : customer_code.trim())
        .input("contact_person_name", sql.VarChar, contact_person_name.trim())
        .input("contact_phone", sql.VarChar, contact_phone.trim())
        .input("contact_email", sql.VarChar, toNull(contact_email?.trim()))
        .input("created_by", sql.VarChar, code)
        .execute("sp_customer_contacts");

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
// Update Contact
// ---------------------------------------------------
export const updateContact = async (req, res) => {
    try {
        const { role, code } = req.user;
        const { contact_id } = req.params;
        let { customer_code, contact_person_name, contact_phone, contact_email, created_by } = req.body;

        const pool = await poolPromise;

        const result = await pool
        .request()
        .input("action", sql.VarChar, "Update")
        .input("contact_id", sql.Int, contact_id)
        .input("customer_code", sql.VarChar, role === "customer" ? code : customer_code.trim())
        .input("contact_person_name", sql.VarChar, contact_person_name.trim())
        .input("contact_phone", sql.VarChar, contact_phone.trim())
        .input("contact_email", sql.VarChar, toNull(contact_email?.trim()))
        .execute("sp_customer_contacts");

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
// Delete Contact
// ---------------------------------------------------
export const deleteContact = async (req, res) => {
    try {
        const { contact_id } = req.params;

        const pool = await poolPromise;

        const result = await pool
        .request()
        .input("action", sql.VarChar, "Delete")
        .input("contact_id", sql.Int, contact_id)
        .execute("sp_customer_contacts");

        const data = result.recordset?.[0];

        if (!data || data.Result === '0') {
            return res.status(400).json({ message: data?.Message || "Delete failed" });
        }

        res.json({ message: data.Message });

    } catch (err) {
        res.status(500).json({ message: "Server error: " + err.message });
    }
};