#!/usr/bin/env node

const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "pg_practikum",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
});

async function migratePasswords() {
  console.log("Starting password migration...");
  
  try {
    const result = await pool.query("SELECT id, email, password FROM users");
    const users = result.rows;
    
    console.log(`Found ${users.length} users to migrate`);
    
    for (const user of users) {
      // Check if password is already hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
      if (user.password && !user.password.startsWith("$2")) {
        console.log(`Hashing password for ${user.email}...`);
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, user.id]);
        console.log(`✓ Migrated ${user.email}`);
      } else {
        console.log(`Skipping ${user.email} (already hashed or no password)`);
      }
    }
    
    console.log("Password migration completed!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migratePasswords();
