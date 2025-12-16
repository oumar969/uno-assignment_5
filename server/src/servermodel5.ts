import { Uno, Player } from "./uno/uno.types";

export type ServerPlayer = {
  id: string;
  name: string;
};

export type ServerGame = {
  id: string;
  players: ServerPlayer[];
  state: Uno;
};
