import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ClientGame } from "../model/domain";
// ==============================================================
// Redux Game Slice
// ==============================================================
// Manages current game state in Redux store
// Updated by: RxJS stream (applyServerEvent)
// payloadAction is a type from redux toolkit that represents an action with a payload
// ==============================================================

interface GameState {
  current: ClientGame | null; // hele game-objektet fra serveren
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

