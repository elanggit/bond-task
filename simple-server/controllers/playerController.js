import axios from 'axios';
import pool from '../db/db';
import Player from '../models/playerModel';
import dotenv from 'dotenv';
import handleError from './errorHandler';
import NodeCache from 'node-cache';

dotenv.config();

const ball_dont_lie_host = 'https://api.balldontlie.io/v1/'
const access_token = '28e05f4b-1159-4fde-b847-7d22820bd616';

// ten minute cache
const cache = new NodeCache({ stdTTL: 600 });

const headers = { 'Authorization': access_token }

const getPlayers = async (req, res) => {
    try {
        const cacheKey = `players_${page}_${limit}`;
        const cachedData = cache.get(cacheKey);
        if (!access_token ) {
            return res.status(500).send('No authorization token found');
        }

        if (cachedData) {
            return res.json(cachedData);
        }

        const { page = 1, limit = 5 } = req.query;
        const response = await getPlayerResponse({ per_page: limit});
        const players =  getPlayerData(response.data.data);
        const meta = response.data.meta
        const total_pages = Math.ceil(meta.total_count / limit);

        const responseData = {
            players: players,
            total_pages: total_pages,
            next_cursor: meta.next_cursor
        };
        cache.set(cacheKey, responseData);
        res.json(responseData);
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
        await getFavoritePlayers({user_id: 1}, result);
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
        await getFavoritePlayers({user_id: 1}, result);
    } catch (error) {
        handleError(error, res);
    }
};

const getFavoritePlayers = async (req, res) => {
    const { user_id } = req.query;
    try {
        const player_ids = await getFavoritePlayerIds(user_id);
        const response = await getPlayerResponse({ 'player_ids[]': player_ids });
        const players = getPlayerData(response.data.data);
        res.json({players: players});
    } catch (error) {
        handleError(error, res);
    }
};

const getPlayerResponse = async (params) => {
    return await axios.get(`${ball_dont_lie_host}/players`, {
        headers: headers,
        params: params
    });
};

const getFavoritePlayerIds = async (user_id) => {
    const result = await pool.query(
        'SELECT id FROM favorite_players WHERE user_id = $1',
        [user_id]
    );
    return result.rows.map(({ id }) => id);
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