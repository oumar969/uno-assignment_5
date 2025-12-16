// ==============================================================
// GraphQL → Domain Model Mappers
// ==============================================================
// Transforms raw GraphQL responses to typed domain objects
// Ensures UI never works with 'any' types
// Functions: toCard(), toPlayer(), toGame()
// ==============================================================

import { ClientGame, ClientPlayer, Card, Color } from "./domain";

export type GraphQLCard = {
  color: string | null;
  type: string | null;
  value?: number;
  back?: boolean;
};

export type GraphQLPlayer = {
  id: string;
  name: string;
  handCount?: number;
  hand?: GraphQLCard[];
};

export type GraphQLGame = {
  id: string;
  players: GraphQLPlayer[];
  topCard?: GraphQLCard;
  activeColor?: string;
  currentPlayer?: GraphQLPlayer;
  winner?: string;
};

export function toCard(card: GraphQLCard | null | undefined): Card | undefined {
  if (!card) return undefined;
  return {
    color: (card.color as Color) || "wild",
    type: (card.type as any),
    value: card.value,
  };
}

export function toPlayer(player: GraphQLPlayer): ClientPlayer {
  return {
    id: player.id,
    name: player.name,
    hand: player.hand?.map(toCard).filter((c): c is Card => c !== undefined) || [],
    saidUno: false,
  };
}

export function toGame(data: GraphQLGame): ClientGame {
  return {
    id: data.id,
    players: data.players.map(toPlayer),
    topCard: toCard(data.topCard),
    activeColor: (data.activeColor as Color),
    currentPlayer: data.currentPlayer ? toPlayer(data.currentPlayer) : undefined,
    winner: data.winner,
    
  };
}
