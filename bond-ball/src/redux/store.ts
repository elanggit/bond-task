import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import playerReducer from './slices/playerSlice';


const store = configureStore({
  reducer: {
    user: userReducer,
    player: playerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
