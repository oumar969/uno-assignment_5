// Redux Store
// Store is made of multiple slices: playerSlice, gameSlice
//single sorce of truth for the app state

import { configureStore } from "@reduxjs/toolkit";
import playerReducer from "../slices(Redux)/playerSlice";
import gameReducer from "../slices(Redux)/gameSlice";

export const store = configureStore({
  reducer: {
    player: playerReducer,
    game: gameReducer,
  },
});
//RootState TypeScript type for read
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
