const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "pg_practikum",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
});

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        module_id INTEGER NOT NULL,
        lesson_id INTEGER NOT NULL,
        completed BOOLEAN DEFAULT false,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, module_id, lesson_id)
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_user_progress_module ON user_progress(user_id, module_id);
    `);

    await client.query("COMMIT");
    console.log("✅ Progress migration completed successfully");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
