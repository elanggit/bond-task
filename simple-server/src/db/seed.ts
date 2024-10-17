require('dotenv').config();

const pool = require('./db');
const createTables = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`
        INSERT INTO users (username, email, hashed_password) VALUES ('Barak', 'example@example.com', 'bcryptpassword');
    `);
    await client.query(`
        INSERT INTO users (username, email, hashed_password) VALUES ('Liz', 'new_email@example.com', 'bcryptpassword');
    `);
    await client.query('COMMIT');
    console.log('Data inserted successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding data:', error);
  } finally {
    client.release();
  }
};

createTables().catch((error) => console.error('Error in createTables:', error));
