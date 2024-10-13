import axios from 'axios';
import User from '../models/user';
import dotenv from 'dotenv';
import handleError from '../errorHandler';
import NodeCache from 'node-cache';
const { formatPlayerData } = require('../services/playerService');


dotenv.config();

const ball_dont_lie_player_endpoint = 'https://api.balldontlie.io/v1/players'
const access_token = process.env.ACCESS_TOKEN;

// thirty minute cache. It is unlikely that the data will change in that time.
const cache = new NodeCache({ stdTTL: 3000 });

const headers = { 'Authorization': access_token }

const handleMissingToken = (res) => {
  return res.status(500).send('No authorization token found')
}

const getPlayers = async (req, res) => {
  if (!access_token ) return handleMissingToken(res);

  const { page = 1, limit = 5, search = '', cursor = null } = req.query;
  const cacheKey = `players_${page}_${limit}_${search}_${cursor}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) return res.json(cachedData);
  try {
    const response = await getPlayerResponse(
      { 
        per_page: limit,
        search: search,
        cursor: page
      }
    );

    const meta_data = response.data.meta
    const responseData = {
      players: formatPlayerData(response.data.data),
      next_cursor: meta_data.next_cursor,
      prev_cursor: meta_data.prev_cursor
    };
    cache.set(cacheKey, responseData);
    handleSuccess(responseData, 'Players fetched successfully');
  } catch (error) {
    handleError(error, res);
  }
};

// TODO: move this function to a separate file
const handleSuccess = ( response, message) => {
  res.status(200).json({ response: response,  message: message });
};

const updateFavoritePlayers = async (req, res, action) => {
  if (!access_token ) return handleMissingToken(res);
  const { user_id, player_id } = req.body;
  const user = new User(user_id);
  try {
    const updatedFavoritePlayers = action == 'add'? await user.addFavoritePlayer(player_id): await user.removeFavoritePlayer(player_id);
    const message = `Player ${action == 'add'? 'added': 'remove'} from favorites successfully`;
    handleSuccess(updatedFavoritePlayers, message);
    } catch (error) {
    handleError(error, res);
  }
}; 

const addFavorite = async (req, res) => {
  return updateFavoritePlayers(req, res, 'add');
};

const removeFavorite = async (req, res) => {
  return updateFavoritePlayers(req, res, 'remove');
};

const getFavorites = async (req, res) => {
  const { user_id } = req.query;
  const user = new User(user_id);
  try {
    const player_ids = await user.getFavoritePlayerIds();
    const response = await getPlayerResponse({ 'player_ids[]': player_ids });
    const formatted_player = formatPlayerData(response.data.data);
    handleSuccess(formatted_player, 'Favorite players fetched successfully');
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
