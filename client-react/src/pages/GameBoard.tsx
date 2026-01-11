// ==============================================================
// Game Board Page
// ==============================================================
// Displays current UNO game state
// Real-time updates via RxJS stream → Redux
// Actions: Play card, Draw card
// Uses Redux for state, not Apollo queries
// ==============================================================

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { RootState } from "../stores/store"; 
import { useSelector } from "react-redux"; // Redux hook
import { useDispatch } from "react-redux"; // Redux hook
import { setGame } from "../slices/gameSlice";
import { apolloClient } from "../model/apollo/client";
import { startGameStream } from "../model/rx/gameStream";
import Hand from "../components/Hand";
import Card from "../components/Card";
import "./GameBoard.css";
import { GET_GAME, apiPlayCard, apiDrawCard } from "../model/api/uno";

export default function GameBoard() {
  const { id } = useParams();
  const dispatch = useDispatch();
  //redux hook der bruges til at få adgang til redux store state i en React komponent
  const game = useSelector((s: RootState) => s.game.current); // hele game-objektet
  const playerId = useSelector((s: RootState) => s.player.id); // min player ID

  // Load game once
  useEffect(() => {
    async function load() {
      const result = await apolloClient.query({
        query: GET_GAME,
        variables: { id },
        fetchPolicy: "no-cache",
      });
      dispatch(setGame(result.data.game));
    }
    load();
  }, [id, dispatch]);

  // Start RxJS stream
  useEffect(() => {
    if (id) startGameStream(id);
  }, [id]);

  if (!game) return <p>Loading game...</p>;

  function play(card: any, index: number) {
    if (!playerId) {
      alert("No player ID found. Join the game first.");
      return;
    }
    const chosenColor =
      card.type === "Wild" || card.type === "WildDrawFour"
        ? prompt("Choose color (red, blue, green, yellow):") || undefined
        : undefined;

    apiPlayCard(id!, playerId!, index, chosenColor).catch((err) => {
      if (err.message.includes("Forbidden")) {
        alert("It's not your turn!");
      } else {
        alert(`Error: ${err.message}`);
      }
    });
  }

  function draw() {
    apiDrawCard(id!, playerId!).catch((err) => {
      if (err.message.includes("Forbidden")) {
        alert("It's not your turn!");
      } else {
        alert(`Error: ${err.message}`);
      }
    });
  }

  return (
    <div className="game-board">
      <h2 className="game-title">UNO Game {game.id}</h2>

      {game.winner && (
        <h1 className="winner-message">🎉 {game.winner} won the game!</h1>
      )}
      <h3>Players:</h3>

      <div className="players-container">
        {game.players.map((p: any) => (
          <div
            key={p.id}
            className={`player-card ${p.id === (game.currentPlayer?.id ?? null) ? 'current-player' : ''}`}
          >
            <div className="player-name">
              {p.name} {p.id === playerId && "(You)"}
            </div>
            <div className="player-status">
              {p.id === (game.currentPlayer?.id ?? null) ? "(Current)" : ""}
            </div>
            <div className="player-hand-info">
              <div className="hand-count">Cards: {p.handCount ?? p.hand?.length ?? 0}</div>
              {/* show small back placeholders for opponents */}
              <div className="opponent-cards">
                {p.id === playerId ? (
                  <Hand hand={p.hand} onPlay={(card, i) => play(card, i)} />
                ) : (
                  Array.from({ length: p.handCount ?? p.hand?.length ?? 0 }).slice(0, 6).map((_, i) => (
                    <Card key={i} back={true} color={null} type={null} />
                  ))
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="top-card-section">
        <h3>Top Card:</h3>
        {game.topCard ? (
          <Card
            color={game.topCard.color}
            type={game.topCard.type}
            value={game.topCard.value}
          />
        ) : (
          <p>No top card</p>
        )}
      </div>

      <div className="active-color-section">
        <h3>Active Color:</h3>
        {game.activeColor ? (
          <div className={`active-color-badge color-${game.activeColor}`}>
            {game.activeColor}
          </div>
        ) : (
          <p>No active color</p>
        )}
      </div>

      <button className="draw-button" onClick={draw}>Draw Card</button>
    </div>
  );
}
