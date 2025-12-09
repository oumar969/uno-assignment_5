import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PlayerState {
  id: string | null;
}

const initialState: PlayerState = {
  id: localStorage.getItem("myPlayerId") || null,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setPlayerId(state, action: PayloadAction<string>) {
      state.id = action.payload;
      localStorage.setItem("myPlayerId", action.payload);
    },
  },
});

export const { setPlayerId } = playerSlice.actions;
export default playerSlice.reducer;


// redux er en global state management løsning der bruges til at håndtere applikationens tilstand på en forudsigelig måde.
