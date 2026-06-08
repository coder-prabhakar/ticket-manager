import sql from "mssql";

const config = {
    user: "sa",
    password: "V2sk@#v2sk",
    server: "DESKTOP-CPKJU73",
    database: "TicketManagerDB",
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};

export const poolPromise = sql.connect(config);
export { sql };