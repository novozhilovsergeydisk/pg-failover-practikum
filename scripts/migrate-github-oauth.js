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

    // Add GitHub OAuth columns
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS github_id VARCHAR(255) UNIQUE;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS github_login VARCHAR(255);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
    `);

    // Make password optional for OAuth users
    await client.query(`
      ALTER TABLE users ALTER COLUMN password DROP NOT NULL;
    `);

    // Create index for faster lookups
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_github_id ON users(github_id);
    `);

    await client.query("COMMIT");
    console.log("✅ GitHub OAuth migration completed successfully");
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
