import pool from '../db/db';

const getFavoritePlayerIds = async (userId) => {
  try {
    const result = await pool.query(
      'SELECT id FROM favorite_players WHERE userId = $1',
      [userId]
    );
    return result.rows.map(({ id }) => id);
  } catch (error) {
    throw error;
  }
};

const addFavoritePlayer = async (userId, playerId) => {
  try {
    await pool.query(
      'INSERT INTO favorite_players (id, userId) VALUES ($1, $2) RETURNING *',
      [playerId, userId]
    );
  } catch (error) {
    throw error;
  }
};

const removeFavoritePlayer = async (userId, playerId) => {
  try {
    await pool.query(
      'DELETE FROM favorite_players WHERE id = $1 AND userId = $2 RETURNING *',
      [playerId, userId]
    );
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addFavoritePlayer,
  removeFavoritePlayer,
  getFavoritePlayerIds,
};
