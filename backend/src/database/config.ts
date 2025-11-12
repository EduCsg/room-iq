import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pgPool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,
  ssl: {
    rejectUnauthorized: false,
  },
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pgPool.on("connect", () => {
  console.log("Database connected successfully");
});

pgPool.on("error", (err) => {
  console.error("Unexpected database error:", err);
  process.exit(-1);
});

// Create a wrapper to log all SQL queries
const pool = {
  query: (text: string, params?: any[]) => {
    const start = Date.now();
    console.log("\n🔍 SQL Query:");
    console.log("📝", text);
    if (params && params.length > 0) {
      console.log("📊 Parameters:", params);
    }

    return pgPool
      .query(text, params)
      .then((res) => {
        const duration = Date.now() - start;
        console.log(
          `✅ Query executed in ${duration}ms - ${res.rowCount} rows`
        );
        return res;
      })
      .catch((err) => {
        const duration = Date.now() - start;
        console.log(`❌ Query failed in ${duration}ms`);
        console.error("Error:", err.message);
        throw err;
      });
  },
  connect: () => pgPool.connect(),
  end: () => pgPool.end(),
};

export default pool;
