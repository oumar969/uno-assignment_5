import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GameState {
  current: any | null; // hele game-objektet fra serveren
}

const initialState: GameState = {
  current: null,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGame(state, action: PayloadAction<any>) {
      state.current = action.payload;
    },

    applyServerEvent(state, action: PayloadAction<any>) {
      // Serveren sender hele game-objektet
      state.current = action.payload;
    },
  },
});

export const { setGame, applyServerEvent } = gameSlice.actions;
export default gameSlice.reducer;


// redux er en global state management løsning der bruges til at håndtere applikationens tilstand på en forudsigelig måde.
// I denne fil defineres en "slice" af redux state specifikt til at håndtere spillets tilstand, såsom den aktuelle spiller, kortene på hånden, spillets status osv.
// Ved at bruge redux kan forskellige komponenter i applikationen få adgang til og opdatere spillets tilstand på en centraliseret måde,
// hvilket gør det lettere at holde styr på ændringer og sikre konsistens på tværs af applikationen.
