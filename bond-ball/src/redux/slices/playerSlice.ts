// file: src/redux/slices/playerSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Player from '../../types/Players';
import { fetchAllPlayers } from '../../services/playerService';

interface PlayerState {
  players: Player[];
  next_cursor: number | null;
  prev_cursor: number | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PlayerState = {
  players: [],
  status: 'idle',
  error: null,
  next_cursor: null,
  prev_cursor: null
};

export const fetchPlayers = createAsyncThunk(
  'player/fetchPlayers',
  async ({
    playersPerPage,
    page,
    searchTerm = '',
    cursor,
  }: {
    playersPerPage: number;
    page: number;
    searchTerm?: string;
    cursor?: number | null;
  }) => {
    const response = await fetchAllPlayers(
      playersPerPage,
      page,
      searchTerm,
      cursor
    );
    return response;
  }
);

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlayers(state, action: PayloadAction<any>) {
      state.players = action.payload.data;
      state.next_cursor = action.payload.meta?.next_cursor;
      state.prev_cursor = action.payload.meta?.prev_cursor;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchPlayers.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.status = 'succeeded';
          state.players = action.payload.data;
          state.next_cursor = action.payload.meta?.next_cursor;
          state.prev_cursor = action.payload.meta?.prev_cursor;
        }
      )
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export const { setPlayers } = playerSlice.actions;

export default playerSlice.reducer;
