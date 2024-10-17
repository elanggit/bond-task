import dotenv from 'dotenv';
import { Pool } from 'pg';
import pool from './db';
const createTables = async () => {
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
                player_id INTEGER NOT NULL,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE (player_id, user_id)
            );
        `);

    await client.query('COMMIT');
    console.log('Tables created successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating tables:', error);
  } finally {
    client.release();
  }
};

createTables().catch((error) => console.error('Error in createTables:', error));
