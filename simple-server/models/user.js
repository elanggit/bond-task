import userService from '../services/userService';

class User {
  constructor(id) {
    this.id = id;
    this.favoritePlayerIds = [];
    this.getFavoritePlayerIds();
  }

  getFavoritePlayerIds = async () => {
    try {
      const favorite_player_ids = await userService.getFavoritePlayerIds(this.id);

      this.favoritePlayerIds = favorite_player_ids;
      return this.favoritePlayerIds
    } catch (error) {
      throw new Error(`Failed to get favorite player: ${error.message}`);
    }
  };

  addFavoritePlayer = async (player_id) => {
    try {
      const alreadyFavorited = this.favoritePlayerIds.some(fave_player_id => fave_player_id === player_id);
      if (alreadyFavorited) {
        return { error: 'The player is already favorited.' };
      } else {
        await userService.addFavoritePlayer(this.id, player_id);
        this.favoritePlayerIds.push(player_id);
        return this.favoritePlayerIds;
      }
    } catch (error) {
      throw new Error(`Failed to add favorite player: ${error.message}`);
    }
  };

  removeFavoritePlayer = async (player_id) => {
    try {
      await userService.removeFavoritePlayer(this.id, player_id);
      this.favoritePlayerIds = this.favoritePlayerIds.filter(fave_player_id => fave_player_id !== player_id);
      return this.favoritePlayerIds;
    } catch (error) {
      throw new Error(`Failed to remove favorite player: ${error.message}`);
    }
  };
};

export default User;
