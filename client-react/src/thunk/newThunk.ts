// thunks/fetchLobby.ts
import type { AppDispatch } from "../stores/store1";
import * as api from "../model/api/uno1";
import * as gameslice from "../slices(Redux)/lobbySlice";


export const fetchLobby =
  () =>
  async (dispatch: AppDispatch) => {
    const games = await api.games();
    dispatch(gameslice.actions.reset(games));

  };
