import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.HOST_URL,
  database: process.env.DATABASE_NAME,
  port: process.env.DB_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.PASSWORD,
  ssl: process.env.SSL === "true" ? { rejectUnauthorized: false } : false,
});

// Test connection on startup
pool
  .connect()
  .then(() => console.log("✅ Connected to PostgreSQL successfully!"))
  .catch((err) => {
    console.error("❌ Database connection error:", err.message);
    process.exit(1);
  });

export const query = async (text, params) => {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
};

export default pool;
 