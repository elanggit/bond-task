import { RootState } from '../store';
import Player from '../../types/Players';

export const selectIsPlayerFavorited = (state: RootState, player: Player): boolean => {
  return state.user.favoritedPlayers.some(favoritedPlayer => favoritedPlayer.id === player.id);
};