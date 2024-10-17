import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

const seedDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS favorite_players (
        id SERIAL PRIMARY KEY,
        player_id INT NOT NULL,
        user_id INT NOT NULL,
        UNIQUE(player_id, user_id)
      );
    `);

    await client.query(`
      INSERT INTO favorite_players (player_id, user_id)
      VALUES
        (1, 1),
        (2, 1),
        (3, 2);
    `);

    console.log('Database seeded successfully');
  } catch (err) {
    console.error('Error seeding database', err);
  } finally {
    client.release();
  }
};

seedDatabase().catch((err) => console.error('Error in seedDatabase:', err));