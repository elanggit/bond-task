import axios from 'axios';
import pool from '../db/db';
import Player from '../models/playerModel';
import dotenv from 'dotenv';
import handleError from './errorHandler';

dotenv.config();

const ball_dont_lie_host = 'https://api.balldontlie.io/v1/'
const access_token = process.env.ACCESS_TOKEN;

// ten minute cache
const cache = new NodeCache({ stdTTL: 600 });

const getPlayers = async (req, res) => {
    try {
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            return res.json(cachedData);
        }
        if (!access_token) {
            return res.status(500).send('No authorization token found');
        }

        const { page = 1, limit = 5 } = req.query;

        const response = await axios.get(`${ball_dont_lie_host}/players`, {
            headers: {
              'Authorization': access_token
            },
            params: {
                per_page: limit
            }
          });
        const players = getPlayerData(response.data.data);
        const meta = response.data.meta
        let total_pages = Math.ceil(meta.total_count / limit);
        const next_cursor = meta.next_cursor;
        cache.set(cacheKey, response.data);
        res.json({
            players: players,
            total_pages: total_pages,
            next_cursor: next_cursor
        });
    } catch (error) {
        handleError(error, res);
    }
};

const addFavoritePlayer = async (req, res) => {
    const { user_id, player_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO favorite_players (id, user_id) VALUES ($1, $2) RETURNING *',
            [user_id, player_id]
        );
        getFavoritePlayers({user_id: 1}, result);
    } catch (error) {
        handleError(error, res);
    }
};

const removeFavoritePlayer = async (req, res) => {
    const { user_id, player_id } = req.body;
    try {
        const result = await pool.query(
            'DELETE FROM favorite_players (id, user_id) VALUES ($1, $2) RETURNING *',
            [user_id, player_id]
        );
        getFavoritePlayers({user_id: 1}, result);
    } catch (error) {
        handleError(error, res);
    }
};

const getFavoritePlayers = async (req, res) => {
    const { user_id } = req.query;
    try {
        const favorite_ids = await pool.query(
            'SELECT id FROM favorite_players WHERE user_id = $1',
            [user_id]
        );

        const player_ids = favorite_ids.rows.map(({ id }) => id);

        const response = await axios.get(`${ball_dont_lie_host}/players`, {
            headers: {
              'Authorization': access_token
            },
            params: {'player_ids[]': player_ids}
          });
        const players = getPlayerData(response.data.data);
        res.json({players: players});
    } catch (error) {
        handleError(error, res);
    }
};

const getPlayerData = (data) => data.map(playerData => {
    return new Player({
        first_name: playerData.first_name,
        last_name: playerData.last_name,
        position: playerData.position,
        height: playerData.height,
        weight: playerData.weight,
        team_name: playerData.team.full_name
    });
});


module.exports = {
    getPlayers,
    getFavoritePlayers,
    addFavoritePlayer,
    removeFavoritePlayer
};