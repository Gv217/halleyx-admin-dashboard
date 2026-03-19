#!/usr/bin/env node
/**
 * init-db.js — Run once (or on every server start) to ensure the DB
 * schema and seed data are in place.
 *
 * Usage:
 *   node backend/config/init-db.js
 *
 * Or imported by server.js:
 *   await require('./config/init-db')();
 */
require('dotenv').config();
const mysql = require('mysql2/promise');
const fs    = require('fs');
const path  = require('path');

async function initDb() {
  const conn = await mysql.createConnection({
    host:               process.env.DB_HOST     || 'localhost',
    port:               parseInt(process.env.DB_PORT || '3306', 10),
    user:               process.env.DB_USER     || 'root',
    password:           process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  try {
    console.log('⚙️  Initializing database…');
    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await conn.query(sql);
    console.log('✅ Database initialized — tables ready, seed data inserted');
  } catch (e) {
    console.error('❌ DB init failed:', e.message);
    throw e;
  } finally {
    await conn.end();
  }
}

// Allow running directly: node config/init-db.js
if (require.main === module) {
  initDb()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = initDb;
