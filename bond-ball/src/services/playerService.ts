import {
  PLAYER_API_HOST,
} from '../constants/apiUrls';

import axios from 'axios';
import Player from '../types/Players';
import { getPlayerOptions } from '../utils/playerOptions';


const fetchAllPlayers = async (
  playersPerPage: number,
  page: number,
  searchTerm = '',
  cursor: number | null | undefined = null
): Promise<Player[]> => {
  const { params } = getPlayerOptions(playersPerPage, page, searchTerm, cursor);
  const response = await axios.get(PLAYER_API_HOST, {
    params,
  });
  return response.data;
};
export { fetchAllPlayers };
