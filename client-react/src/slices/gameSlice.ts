// Manages current game state in Redux store
// Updated by: RxJS stream (applyServerEvent)
// payloadAction is a type from redux toolkit that describes
//  what an action looks like when it has a payload
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ClientGame } from "../model/domain";

interface GameState {
  current: ClientGame | null; // The current game data
}

const initialState: GameState = {
  current: null,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGame(state, action: PayloadAction<ClientGame>) {
    return { current: action.payload };
    },

    applyServerEvent(state, action: PayloadAction<ClientGame>) {
      // Serveren sender hele game-objektet
      return { current: action.payload };
    },
  },
});

export const { setGame, applyServerEvent } = gameSlice.actions;
export default gameSlice.reducer;

