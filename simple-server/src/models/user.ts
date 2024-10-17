import {
  getFavoritePlayerIds as getFavoritePlayerIdsAPI,
  addFavoritePlayer as addFavoritePlayerAPI,
  removeFavoritePlayer as removeFavoritePlayerAPI,
} from '../services/userService';
import { errorMessage } from '../utils/errors';

class User {
  id: number;
  favoritePlayerIds: number[];

  constructor(id: number) {
    this.id = id;
    this.favoritePlayerIds = [];
    this.getFavoritePlayerIds();
  }
  getFavoritePlayerIds = async () => {
    try {
      const favorite_playerIds = await getFavoritePlayerIdsAPI(this.id);
      this.favoritePlayerIds = favorite_playerIds;
      return this.favoritePlayerIds;
    } catch (error) {
      throw new Error(errorMessage(error))
    }
  };

  addFavoritePlayer = async (playerId: number) => {
    try {
      const favorites = await this.getFavoritePlayerIds();
      const alreadyFavorited = favorites.some(
        (fave_playerId: number) => fave_playerId === playerId
      );
      if (alreadyFavorited) {
        return { error: 'The player is already favorited.' };
      } else {
        const response = await addFavoritePlayerAPI(this.id, playerId);
        this.favoritePlayerIds.push(playerId);
        return response;
      }
    } catch (error) {
      throw new Error(errorMessage(error))
    }
  };

  removeFavoritePlayer = async (playerId: number) => {
    try {
      this.favoritePlayerIds = this.favoritePlayerIds.filter(
        (fave_playerId) => fave_playerId !== playerId
      );
      const reponse = await removeFavoritePlayerAPI(this.id, playerId);
      return reponse;
    } catch (error) {
      throw new Error(errorMessage(error))
    }
  };
}

export default User;
