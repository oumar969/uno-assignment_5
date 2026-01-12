// Domain Model - Client Types
// Re-exports server types (Card, Player, Uno) for type safety
// ClientGame wraps server model with GraphQL-specific fields

import { Card, Color, Player, Uno } from "../../../server/src/uno/uno.types";

export type { Card, Player, Uno, Color } from "../../../server/src/uno/uno.types";

// alias type
export type ClientPlayer = Player;

export type ClientGame = {
  id: string;
  players: ClientPlayer[];
  state?: Uno;
  topCard?: Card;
  activeColor?: Color;
  currentPlayer?: ClientPlayer;
  winner?: string;
};
