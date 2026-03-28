import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

export default defineConfig({
  schema: "./src/schema/**/*.{ts,js}",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.PG_HOST || "",
    port: Number(process.env.PG_PORT || 5432),
    user: process.env.PG_USER || "",
    password: process.env.PG_PASSWORD || "",
    database: process.env.PG_DB || "",
    ssl: false,
  },
});
