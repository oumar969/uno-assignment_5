// ==============================================================
// UNO Game API Client
// ==============================================================
// GraphQL queries and mutations for UNO game
// Maps GraphQL responses to domain model using toGame()
// ==============================================================

import { gql } from "@apollo/client";
import { apolloClient } from "../apollo/client";
import { ClientGame } from "../domain";
import { toGame } from "../mappers";

// ----------------------------------------------------------
// GraphQL Queries
// ----------------------------------------------------------
export const GET_GAMES = gql`
  query {
    games {
      id
      players { id name }
    }
  }
`;

export const GET_GAME = gql`
  query Game($id: ID!) {
    game(id: $id) {
      id
      winner
      topCard { color type value }
      activeColor
      currentPlayer { id name }
      players {
        id
        name
        hand { color type value back }
        handCount
      }
    }
  }
`;

// ----------------------------------------------------------
// GraphQL Mutations
// ----------------------------------------------------------
const CREATE_GAME = gql`
  mutation {
    createGame {
      id
      players { id name }
      topCard { color type value }
      activeColor
      currentPlayer { id name }
      winner
    }
  }
`;

const JOIN_GAME = gql`
  mutation Join($gameId: ID!, $name: String!) {
    joinGame(gameId: $gameId, name: $name) {
      game {
        id
        players { id name }
        topCard { color type value }
        activeColor
        currentPlayer { id name }
        winner
      }
      viewerId
    }
  }
`;

const PLAY_CARD = gql`
  mutation Play(
    $gameId: ID!, 
    $playerId: ID!, 
    $cardIndex: Int!, 
    $chosenColor: String
  ) {
    playCard(
      gameId: $gameId, 
      playerId: $playerId, 
      cardIndex: $cardIndex, 
      chosenColor: $chosenColor
    ) {
      id
      winner
      activeColor
      topCard { color type value }
      players { 
        id name 
        hand { color type value back }
      }
    }
  }
`;

const DRAW_CARD = gql`
  mutation Draw($gameId: ID!, $playerId: ID!) {
    drawCard(gameId: $gameId, playerId: $playerId) {
      id
      winner
      activeColor
      topCard { color type value }
      currentPlayer { id name }
      players {
        id
        name
        handCount
        hand { color type value back }
      }
    }
  }
`;

// ----------------------------------------------------------
// API Functions (GraphQL → Domain Model)
// ----------------------------------------------------------

// ----------------------------------------------------------
// Create new game
// ----------------------------------------------------------
export async function apiCreateGame(): Promise<ClientGame> {
  const res = await apolloClient.mutate({ mutation: CREATE_GAME });
  return toGame(res.data.createGame);
}

// ----------------------------------------------------------
// Join game and persist player ID
// ----------------------------------------------------------
export async function apiJoinGame(gameId: string, name: string): Promise<ClientGame> {
  const res = await apolloClient.mutate({
    mutation: JOIN_GAME,
    variables: { gameId, name },
  });
  // Persist viewerId so client sends x-player-id header on subsequent requests
  const payload = res.data.joinGame;
  if (payload?.viewerId) {
    localStorage.setItem("myPlayerId", payload.viewerId);
  }
  return toGame(payload?.game);
}

// ----------------------------------------------------------
// Play a card from hand
// ----------------------------------------------------------
export async function apiPlayCard(gameId: string, playerId: string, cardIndex: number, chosenColor?: string): Promise<ClientGame> {
  const res = await apolloClient.mutate({
    mutation: PLAY_CARD,
    variables: { gameId, playerId, cardIndex, chosenColor },
  });
  return toGame(res.data.playCard);
}

// ----------------------------------------------------------
// Draw a card from deck
// ----------------------------------------------------------
export async function apiDrawCard(gameId: string, playerId: string): Promise<ClientGame> {
  const res = await apolloClient.mutate({
    mutation: DRAW_CARD,
    variables: { gameId, playerId },
  });
  return toGame(res.data.drawCard);
}
