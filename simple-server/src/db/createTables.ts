import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

const createTables = async (): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query('DROP TABLE IF EXISTS favorite_players CASCADE;');
    await client.query('DROP TABLE IF EXISTS users CASCADE;');

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR UNIQUE NOT NULL,
        email VARCHAR UNIQUE NOT NULL,
        hashed_password VARCHAR NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS favorite_players (
        id SERIAL PRIMARY KEY,
        player_id INT NOT NULL,
        user_id INT NOT NULL,
        UNIQUE(player_id, user_id)
      );
    `);

    await client.query('COMMIT');
    console.log('Tables created successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating tables', err);
  } finally {
    client.release();
  }
};

createTables().catch((err) => console.error('Error in createTables:', err));