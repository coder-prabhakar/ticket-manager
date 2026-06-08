import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { poolPromise, sql } from "../config/db.js";
import { comparePassword } from "../utils/hash.js";
import { generateTokenForCustomer, generateTokenForMember } from "../utils/jwt.js";

dotenv.config();

export const login = async (req, res) => {
    const { code, password, accountType } = req.body;

    if (!code || !password || !accountType) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const pool = await poolPromise;

        const result = await pool
        .request()
        .input("AccountType", sql.VarChar, accountType)
        .input("Code", sql.VarChar, code)
        .execute("sp_Login");

        const data = result.recordset[0];

        // Login failed
        if (data.Result === '0') {
            return res.status(401).json({ message: data.Message });
        }

        const isMatch = await comparePassword(password, data.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Password" });
        }

        // Success
        let token = jwt.sign(
            { code: data.code, role: data.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            token: token,
            user: {
                code: data.code,
                name: data.name,
                role: data.role,
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error: " + err.message });
    }
};