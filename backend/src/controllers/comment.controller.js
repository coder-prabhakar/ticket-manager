import { poolPromise, sql } from "../config/db.js";


// ---------------------------------------------------
// Get Comments By Task ID
// ---------------------------------------------------
export const getCommentsByTaskId = async (req, res) => {
    try {

        const { taskId } = req.params;

        const pool = await poolPromise;

        const result = await pool
            .request()
            .input("action", sql.VarChar, "GET")
            .input("comment_task_id", sql.Int, taskId)
            .execute("sp_tasks_comments");

        res.json(result.recordset);

    } catch (err) {
        res.status(500).json({
            message: "Server error: " + err.message
        });
    }
};


// ---------------------------------------------------
// Create Comment
// ---------------------------------------------------
export const createComment = async (req, res) => {
    try {
        const { code } = req.user;

        let { comment_message, comment_task_id } = req.body;

        const pool = await poolPromise;

        const result = await pool
            .request()
            .input("action", sql.VarChar, "INSERT")
            .input("comment_message", sql.VarChar, comment_message?.trim())
            .input("comment_task_id", sql.Int, comment_task_id)
            .input("comment_user_code", sql.VarChar, code)
            .execute("sp_tasks_comments");

        const data = result.recordset?.[0];

        if (!data || data.Result === 0) {
            return res.status(400).json({
                message: data?.Message || "Insert failed"
            });
        }

        res.status(201).json({
            message: data.Message
        });

    } catch (err) {
        res.status(500).json({
            message: "Server error: " + err.message
        });
    }
};