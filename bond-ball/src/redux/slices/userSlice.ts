import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getFavoritePlayers,
  addFavoritePlayer as addFavoritePlayerAPI,
  removeFavoritePlayer as removeFavoritePlayerAPI,
} from '../../services/userService';
import Player from '../../types/Players';

interface UserState {
  id: number ;
  favoritedPlayers: Player[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  next_cursor: number | null;
  prev_cursor: number | null;
  error: string | null;
}

const initialState: UserState = {
  // This is hardcoded for now, but should be determined via auth
  id: 1,
  favoritedPlayers: [],
  status: 'idle',
  error: null,
  next_cursor: null,
  prev_cursor: null
};

export const fetchFavoritePlayers = createAsyncThunk(
  'user/fetchFavoritePlayers',
  async ({ userId }: { userId: number }) => {
    const response = await getFavoritePlayers(userId);
    return response;
  }
);

export const addFavoritePlayer = createAsyncThunk(
  'user/addFavoritePlayer',
  async ({ userId, player }: { userId: number; player: Player }) => {
    await addFavoritePlayerAPI(player.id, userId);
    return player;
  }
);

export const removeFavoritePlayer = createAsyncThunk(
  'user/removeFavoritePlayer',
  async ({ userId, player }: { userId: number; player: Player }) => {
    await removeFavoritePlayerAPI(player.id, userId);
    return player;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // This should be determined via auth, but for the sake of this example, we'll hardcode it
    setUserId(state, action: PayloadAction<number>) {
      state.id = 1;
    },
    setFavoritePlayers(state, action: PayloadAction<any>) {
      state.favoritedPlayers = action.payload.data;

    },
    setAddFavoritePlayer(state, action: PayloadAction<any>) {
      state.favoritedPlayers.push(action.payload);
    },
    setRemoveFavoritePlayer(state, action: PayloadAction<any>) {
      state.favoritedPlayers = state.favoritedPlayers.filter(player => player.id !== action.payload.id)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavoritePlayers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchFavoritePlayers.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.status = 'succeeded';
          state.favoritedPlayers = action.payload;
        }
      )
      .addCase(fetchFavoritePlayers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(
        addFavoritePlayer.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.favoritedPlayers.push(action.payload);
        }
      )
      .addCase(
        removeFavoritePlayer.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.favoritedPlayers = state.favoritedPlayers.filter(player => player.id !== action.payload.id);
        }
      );
  },
});

export const { setUserId, setFavoritePlayers, setAddFavoritePlayer, setRemoveFavoritePlayer } = userSlice.actions;

export default userSlice.reducer;
