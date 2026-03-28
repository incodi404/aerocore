import {Pool} from "pg"

export const pgPool = new Pool({
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT || 0),
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB,
    max: 3, // max connection
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
})