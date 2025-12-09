import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux"; // Redux hook
import { RootState } from "../redux/store"; 
import { apolloClient } from "../apollo/client";
import { GET_GAME, apiPlayCard, apiDrawCard } from "../api/uno";
import { useDispatch } from "react-redux"; // Redux hook
import { setGame } from "../redux/gameSlice";
import { startGameStream } from "../rx/gameStream";
import Hand from "../components/Hand";
import Card from "../components/Card";

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

    apiPlayCard(id!, playerId!, index, chosenColor);
  }

  function draw() {
    apiDrawCard(id!, playerId!);
  }

  return (
    <div>
      <h2>UNO Game {game.id}</h2>

      {game.winner && (
        <h1>🎉 {game.winner} won the game!</h1>
      )}
      <h3>Players:</h3>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {game.players.map((p: any) => (
          <div
            key={p.id}
            style={{
              border: p.id === (game.currentPlayer?.id ?? null) ? "2px solid #2ecc71" : "1px solid #ddd",
              padding: 8,
              borderRadius: 8,
              minWidth: 160,
            }}
          >
            <div style={{ fontWeight: "bold" }}>
              {p.name} {p.id === playerId && "(You)"}
            </div>
            <div style={{ fontSize: 12, color: "#666" }}>
              {p.id === (game.currentPlayer?.id ?? null) ? "(Current)" : ""}
            </div>
            <div style={{ marginTop: 8 }}>
              <div style={{ marginBottom: 6 }}>Cards: {p.handCount ?? p.hand?.length ?? 0}</div>
              {/* show small back placeholders for opponents */}
              <div style={{ display: "flex", gap: 4 }}>
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

      {/* Player hands are shown above in the Players list (no duplicate) */}
<h3>Active Color:</h3>

{game.activeColor ? (
  <div
    style={{
      width: "80px",
      height: "30px",
      borderRadius: "8px",
      background:
        game.activeColor === "red"
          ? "#e74c3c"
          : game.activeColor === "blue"
          ? "#3498db"
          : game.activeColor === "green"
          ? "#2ecc71"
          : game.activeColor === "yellow"
          ? "#f1c40f"
          : "#999",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "#fff",
      fontWeight: "bold",
      textTransform: "uppercase",
    }}
  >
    {game.activeColor}
  </div>
) : (
  <p>No active color</p>
)}


      <button onClick={draw}>Draw Card</button>
    </div>
  );
}
