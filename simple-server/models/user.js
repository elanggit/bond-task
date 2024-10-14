import userService from '../services/userService';

class User {
  constructor(id) {
    this.id = id;
    this.favoritePlayerIds = [];
    this.getFavoritePlayerIds();
  }

  getFavoritePlayerIds = async () => {
    try {
      const favorite_playerIds = await userService.getFavoritePlayerIds(
        this.id
      );
      this.favoritePlayerIds = favorite_playerIds;
      return this.favoritePlayerIds;
    } catch (error) {
      throw new Error(`Failed to get favorite player: ${error.message}`);
    }
  };

  addFavoritePlayer = async (playerId) => {
    try {
      const alreadyFavorited = this.favoritePlayerIds.some(
        (fave_playerId) => fave_playerId === playerId
      );
      if (alreadyFavorited) {
        return { error: 'The player is already favorited.' };
      } else {
        await userService.addFavoritePlayer(this.id, playerId);
        this.favoritePlayerIds.push(playerId);
        return playerId;
      }
    } catch (error) {
      throw new Error(`Failed to add favorite player: ${error.message}`);
    }
  };

  removeFavoritePlayer = async (playerId) => {
    try {
      await userService.removeFavoritePlayer(this.id, playerId);
      this.favoritePlayerIds = this.favoritePlayerIds.filter(
        (fave_playerId) => fave_playerId !== playerId
      );
      return playerId;
    } catch (error) {
      throw new Error(`Failed to remove favorite player: ${error.message}`);
    }
  };
}

export default User;
