import axios from 'axios';
import pool from '../db/db';
import Player from '../models/player';
import User from '../models/user';
import dotenv from 'dotenv';
import handleError from '../errorHandler';
import NodeCache from 'node-cache';

dotenv.config();

const ball_dont_lie_player_endpoint = 'https://api.balldontlie.io/v1/players'
const access_token = process.env.ACCESS_TOKEN;
const { formatPlayerData } = require('../services/playerService');

// thirty minute cache. It is unlikely that the data will change in that time.
const cache = new NodeCache({ stdTTL: 3000 });

const headers = { 'Authorization': access_token }

const getPlayers = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = '', cursor = null } = req.query;
    const cacheKey = `players_${page}_${limit}_${search}_${cursor}`;
    const cachedData = cache.get(cacheKey);
    if (!access_token ) {
      return res.status(500).send('No authorization token found');
    }

    if (cachedData) {
      return res.json(cachedData);
    }
    const response = await getPlayerResponse(
      { 
        per_page: limit,
        search: search,
        cursor: page
      }
    );
    const formatted_players = formatPlayerData(response.data.data);
    const meta = response.data.meta

    const responseData = {
      players: formatted_players,
      next_cursor: meta.next_cursor,
      prev_cursor: meta.prev_cursor
    };
    cache.set(cacheKey, responseData);
    res.json(responseData);
  } catch (error) {
    handleError(error, res);
  }
};

const addFavorite = async (req, res) => {
  const { user_id, player_id } = req.body;
  try {
    const user = new User(user_id);
    await user.addFavoritePlayer(player_id);
      res.json({ success: true, message: 'Player added to favorites successfully' });
    } catch (error) {
    handleError(error, res);
  }
};

const removeFavorite = async (req, res) => {
  const { user_id, player_id } = req.body;
  try {
    const user = new User(user_id);
    await user.removeFavoritePlayer(player_id);
    res.json({ success: true, message: 'Player removed from favorites successfully'});
  } catch (error) {
    handleError(error, res);
  }
};

const getFavorites = async (req, res) => {
  const { user_id } = req.query;
  try {
    const user = new User(user_id);
    const player_ids = await user.getFavoritePlayerIds();
    const response = await getPlayerResponse({ 'player_ids[]': player_ids });
    const formatted_player = formatPlayerData(response.data.data);
    res.json({ players: formatted_player });
  } catch (error) {
    handleError(error, res);
  }
};

const getPlayerResponse = async (params) => {
  return await axios.get(ball_dont_lie_player_endpoint, {
    headers: headers,
    params: params
  });
};

module.exports = {
  getPlayers,
  getFavorites,
  addFavorite,
  removeFavorite
};
