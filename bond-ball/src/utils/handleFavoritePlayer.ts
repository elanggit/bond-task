import {
  addFavoritePlayer as addFavoritePlayerAPI,
  removeFavoritePlayer as removeFavoritePlayerAPI,
} from '../services/playerService';
import Player from '../types/Players';

const handleFavoritePlayer = (
  player: Player,
  favoritePlayers: Player[],
  userId: number,
  dispatch: any
) => {
  const isFavoritePlayer = favoritePlayers.some(
    (favPlayer) => favPlayer.id === player.id
  );
  return isFavoritePlayer
    ? removeFavoritePlayer(player, userId, dispatch)
    : addFavoritePlayer(player, userId, dispatch);
};

const removeFavoritePlayer = async (player: Player, userId: number, dispatch: any) => {
  try {
    const favoritePlayers = await removeFavoritePlayerAPI(player.id, userId);
    dispatch(await removeFavoritePlayer(player, userId, dispatch));
    return favoritePlayers;
  } catch (error) {
    console.error('Error removing favorite player:', error);
  }
};

const addFavoritePlayer = async (player: Player, userId: number,dispatch: any) => {
  try {
    const favoritePlayers = await addFavoritePlayerAPI(player.id, userId);
    dispatch(await addFavoritePlayer(player, userId, dispatch));
    return favoritePlayers;
  } catch (error) {
    console.error('Error removing favorite player:', error);
  }
};

export default handleFavoritePlayer;

