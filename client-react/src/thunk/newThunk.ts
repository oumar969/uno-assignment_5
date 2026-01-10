import { createAsyncThunk } from "@reduxjs/toolkit";
import { GET_GAME } from "../../../server/src/schema1";
import { apolloClient } from "../model/apollo/client";
// Thunk to fetch game by ID
//async action creator
//side-effect logic
export const fetchGameById = createAsyncThunk(
  "game/fetchById",
  async (gameId: string) => {
    const res = await apolloClient.query({
      query: GET_GAME,
      variables: { id: gameId },
      fetchPolicy: "no-cache",
    });

    return res.data.game; // payload
  }
);
