import {
  addFavoritePlayer as addFavoritePlayerAPI,
  removeFavoritePlayer as removeFavoritePlayerAPI,
} from '../services/playerService';
import Player from '../types/Players';

const handleFavoritePlayer = (
  player: Player,
  favoritePlayers: Player[],
  user_id: number
) => {
  const isFavoritePlayer = favoritePlayers.some(
    (favPlayer) => favPlayer.id === player.id
  );
  return isFavoritePlayer
    ? removeFavoritePlayer(player, user_id)
    : addFavoritePlayer(player, user_id);
};

const removeFavoritePlayer = async (player: Player, user_id: number) => {
  try {
    const favoritePlayers = await removeFavoritePlayerAPI(player.id, user_id);
    return favoritePlayers;
  } catch (error) {
    console.error('Error removing favorite player:', error);
  }
};

const addFavoritePlayer = async (player: Player, user_id: number) => {
  try {
    const favoritePlayers = await addFavoritePlayerAPI(player.id, user_id);
    console.log(favoritePlayers);
    return favoritePlayers;
  } catch (error) {
    console.error('Error removing favorite player:', error);
  }
};

export default handleFavoritePlayer;
