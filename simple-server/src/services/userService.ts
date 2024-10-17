import pool from '../db/db';
export const getFavoritePlayerIds = async (userId: number) => {
  try {
    const result = await pool.query(
      'SELECT player_id FROM favorite_players WHERE user_id = $1',
      [userId]
    );
    return result.rows.map(({ player_id }) => player_id);
  } catch (error) {
    throw error;
  }
};

export const addFavoritePlayer = async (userId: number, playerId: number) => {
  try {
    const result = await pool.query(
      'INSERT INTO favorite_players (player_id, user_id) VALUES ($1, $2) RETURNING *',
      [playerId, userId]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const removeFavoritePlayer = async (
  userId: number,
  playerId: number
) => {
  try {
    const query =
      'DELETE FROM favorite_players WHERE player_id = $1 AND user_id = $2 RETURNING *';
    const values = [playerId, userId];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};
