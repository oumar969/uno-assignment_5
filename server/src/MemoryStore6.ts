import { ServerResponse } from "./ServerResponse7";
import { ServerGame } from "./servermodel5";

export type StoreError = 
  | { type: 'Not Found'; key: any } 
  | { type: 'DB Error'; error: any };

export interface GameStore {
  games(): Promise<ServerResponse<ServerGame[], StoreError>>;
  game(id: string): Promise<ServerResponse<ServerGame, StoreError>>;
  add(game: ServerGame): Promise<ServerResponse<ServerGame, StoreError>>;
  update(game: ServerGame): Promise<ServerResponse<ServerGame, StoreError>>;
}


export const createInMemoryStore = (): GameStore => {
  const games: ServerGame[] = [];

  return {
    async games() {
      return ServerResponse.ok(games);
    },

    async game(id: string) {
      const game = games.find((g) => g.id === id);
      return game
        ? ServerResponse.ok(game)
        : ServerResponse.error<StoreError>({ type: 'Not Found', key: id });
    },

    async add(game: ServerGame) {
      games.push(game);
      return ServerResponse.ok(game);
    },

    async update(game: ServerGame) {
      const index = games.findIndex((g) => g.id === game.id);
      if (index === -1) {
        return ServerResponse.error<StoreError>({ type: 'Not Found', key: game.id });
      }
      games[index] = game;
      return ServerResponse.ok(game);
    },
  };
};
