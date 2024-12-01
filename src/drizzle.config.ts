import dotenv from "dotenv"
import { defineConfig } from "drizzle-kit";
dotenv.config({ path: "../.env" });

export default defineConfig({
  out: "./drizzle",
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.PGHOST!,
    port: parseInt(process.env.PGPORT!),
    database: process.env.PGDATABASE!,
    user: process.env.PGUSER!,
    password: process.env.PGPASSWORD!,
    ssl: false
  },
});