// ==============================================================
// Lobby Page
// ==============================================================
// Lists all games
// Actions: Create new game, Join existing game
// Uses Apollo useQuery to fetch games
// ==============================================================

import React from "react";
import { useQuery } from "@apollo/client/react/hooks";
import { GET_GAMES } from "../model/api/uno";
import { apiCreateGame, apiJoinGame } from "../model/api/uno";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPlayerId } from "../slices/playerSlice";

export default function Lobby() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, loading, refetch } = useQuery(GET_GAMES, {
    fetchPolicy: "no-cache",
  });

  async function handleCreate() {
    const name = prompt("Enter your name:");
    if (!name) return;

    const newGame = await apiCreateGame();
    const joined = await apiJoinGame(newGame.id, name);

    const me = joined.players.find((p: any) => p.name === name);
    if (me) dispatch(setPlayerId(me.id));

    navigate(`/game/${newGame.id}`);
  }

  async function handleJoin(gameId: string) {
    const name = prompt("Enter your name:");
    if (!name) return;

    const joined = await apiJoinGame(gameId, name);

    const me = joined.players.find((p: any) => p.name === name);
    if (me) dispatch(setPlayerId(me.id));

    navigate(`/game/${gameId}`);
  }

  return (
    <div>
      <h2>🎮 UNO Lobby</h2>

      <button onClick={handleCreate}>➕ Create Game</button>

      {loading && <p>Loading games...</p>}

      <ul>
        {data?.games?.map((g: any) => (
          <li key={g.id}>
            Game {g.id} ({g.players.length} players)
            <button onClick={() => handleJoin(g.id)}>Join</button>
          </li>
        ))}
      </ul>

      <button onClick={() => refetch()}>Refresh</button>
    </div>
  );
}
