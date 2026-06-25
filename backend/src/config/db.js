import sql from "mssql";

const config = {
    user: "sa",
    password: "V2sk@#v2sk",
    server: "DESKTOP-E1S12D5",
    database: "TaskManagerDB",
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};

export const poolPromise = sql.connect(config);
export { sql };