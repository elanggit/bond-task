const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const createTables = async () => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        await client.query('DROP TABLE IF EXISTS favorite_players CASCADE;');
        await client.query('DROP TABLE IF EXISTS users CASCADE;');

        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                hashed_password VARCHAR(100) NOT NULL
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS favorite_players (
                id SERIAL PRIMARY KEY,
                player_id INT NOT NULL,
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

createTables().catch(error => console.error('Error in createTables:', error));
