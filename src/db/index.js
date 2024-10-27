import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

const prisma = new PrismaClient();

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'ch_four',
  user: 'postgres',
  password: 'postgres',
});

export const query = (text, params) => pool.query(text, params);
