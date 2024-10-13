import pool from '../db/db';

const getFavoritePlayerIds = async (user_id) => {
  try {
    const result = await pool.query(
    'SELECT id FROM favorite_players WHERE user_id = $1',
    [user_id]
    );
    return result.rows.map(({ id }) => id);
  } catch (error) {
    throw error;
  }
};

const addFavoritePlayer = async (user_id, player_id) => {
  try {
    await pool.query(
      'INSERT INTO favorite_players (id, user_id) VALUES ($1, $2) RETURNING *',
      [player_id, user_id]
    );
  } catch (error) {
    throw error;
  }
};

const removeFavoritePlayer = async (user_id, player_id) => {
  try {
    await pool.query(
      'DELETE FROM favorite_players WHERE id = $1 AND user_id = $2 RETURNING *',
      [player_id, user_id]
    );
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addFavoritePlayer,
  removeFavoritePlayer,
  getFavoritePlayerIds
};
