// @ts-ignore
import * as _ from 'lodash/fp'
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ClientGame } from "../model/domain";

export type GameState = Readonly<{ current: ClientGame | null }>;

const initial_state: GameState = { current: null };
// Reducers as a separate object, explicit immutable style
const game_reducers = {
  setGame(_state: GameState, action: PayloadAction<ClientGame>): GameState {
    return { current: action.payload };
  },
  applyServerEvent(_state: GameState, action: PayloadAction<ClientGame>): GameState {
    return { current: action.payload };
  },
};

export const gameSlice = createSlice({
  name: "game",
  initialState: initial_state,
  reducers: game_reducers,
});

export const { setGame, applyServerEvent } = gameSlice.actions;
export default gameSlice.reducer;
