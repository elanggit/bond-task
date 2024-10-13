import {
  ADD_FAVORITE_PLAYER_URL,
  REMOVE_FAVORITE_PLAYER_URL,
} from '../constants/apiUrls.ts';

import axios from 'axios';

const addFavoritePlayer = async (player_id, user_id) => {
  const body = { player_id: player_id, user_id: user_id };
  const response = await axios.post(ADD_FAVORITE_PLAYER_URL, body);
  return response.data;
};

const removeFavoritePlayer = async (player_id, user_id) => {
  const body = { player_id: player_id, user_id: user_id };
  const response = await axios.post(REMOVE_FAVORITE_PLAYER_URL, body);
  return response.data;
};

export {
  addFavoritePlayer,
  removeFavoritePlayer
};
