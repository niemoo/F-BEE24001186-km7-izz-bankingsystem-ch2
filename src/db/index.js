const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');

const prisma = new PrismaClient();

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'ch_four',
  user: 'postgres',
  password: 'postgres',
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
