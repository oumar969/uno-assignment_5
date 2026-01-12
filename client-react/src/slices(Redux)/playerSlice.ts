// Redux Player Slice
// Manages current player ID 
// Set after joining a game

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
//export type PlayerState =  {
interface PlayerState {
  id: string | null;
}

const initialState: PlayerState = { id: localStorage.getItem("myPlayerId") || null,};
// create reduser
const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setPlayerId(state, action: PayloadAction<string>) {
      state.id = action.payload;
      localStorage.setItem("myPlayerId", action.payload);
      /*
      setPlayerId(state, action: PayloadAction<string>) {
            return { id: action.payload };
          },
      */
    },
  },
});
export const { setPlayerId } = playerSlice.actions;
export default playerSlice.reducer;

/*
the reducer 'setPlayerId'  should be a pure function

but since we are using Redux Toolkit, which uses Immer library under the hood,
we can safely write "mutating" logic in reducers. Immer takes care of producing
a new immutable state based on the mutations we make to the draft state.
*/

