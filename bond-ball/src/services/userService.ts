import {
  ADD_FAVORITE_PLAYER_URL,
  REMOVE_FAVORITE_PLAYER_URL,
  FAVORITE_PLAYER_URL
} from '../constants/apiUrls';

import axios from 'axios';

const getFavoritePlayers = async (userId: number) => {
  const response = await axios.get(`${FAVORITE_PLAYER_URL}?userId=${userId}`);
  return response.data.data;
};

const addFavoritePlayer = async (playerId: number, userId: number) => {
    const body = { playerId: playerId, userId: userId };
    const response = await axios.post(ADD_FAVORITE_PLAYER_URL, body);
    return response.data;
};

const removeFavoritePlayer = async (playerId: number, userId: number) => {
    const body = { playerId: playerId, userId: userId };
    const response = await axios.post(REMOVE_FAVORITE_PLAYER_URL, body);
    return response.data;
};

export { getFavoritePlayers, addFavoritePlayer, removeFavoritePlayer };
