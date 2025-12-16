import { v4 as uuidv4 } from "uuid";
import { ServerResponse } from "./ServerResponse7";
import {
  createFunctionalGame,
  playFunctionalCard,
  drawFunctionalCard,
  sayUNO as sayUNOFunc,
  Color,
} from "./uno/index";
import { GameStore, StoreError } from "./MemoryStore6";
import { Broadcaster } from "./broadcaster8";
import { ServerGame } from "./servermodel5";

const Forbidden = { type: 'Forbidden' } as const;

export type ServerError = typeof Forbidden | StoreError;

export type API = {
  games: () => Promise<ServerResponse<ServerGame[], ServerError>>;
  game: (id: string) => Promise<ServerResponse<ServerGame, ServerError>>;
  createGame: () => Promise<ServerResponse<ServerGame, ServerError>>;
  joinGame: (gameId: string, name: string, viewerId?: string) => Promise<ServerResponse<{ game: ServerGame; viewerId: string }, ServerError>>;
  playCard: (gameId: string, playerId: string, cardIndex: number, chosenColor?: string) => Promise<ServerResponse<ServerGame, ServerError>>;
  drawCard: (gameId: string, playerId: string) => Promise<ServerResponse<ServerGame, ServerError>>;
  sayUNO: (gameId: string, playerId: string) => Promise<ServerResponse<ServerGame, ServerError>>;
};

export const createAPI = (broadcaster: Broadcaster, store: GameStore): API => {
  function validPlayer(player: string, game: ServerGame): boolean {
    const currentPlayer = game.state.players[game.state.currentPlayer];
    return currentPlayer.name === player;
  }

  async function update(id: string, playerId: string, processor: (game: ServerGame) => ServerGame): Promise<ServerResponse<ServerGame, ServerError>> {
    const gameRes = await store.game(id);
    const playerRes = gameRes.flatMap(game => {
      const player = game.players.find((p: any) => p.id === playerId);
      return player 
        ? ServerResponse.ok({ game, player }) 
        : ServerResponse.error<ServerError>({ type: 'Not Found', key: playerId });
    });

    const processed = playerRes
      .filter(({ game, player }) => validPlayer(player.name, game), _ => Forbidden)
      .map(({ game }) => processor(game));

    return processed.asyncFlatMap(game => store.update(game));
  }

  async function broadcast(game: ServerGame): Promise<void> {
    await broadcaster.send(game);
  }

  async function games() {
    return store.games();
  }

  async function game(id: string) {
    return store.game(id);
  }

  async function createGame() {
    const id = uuidv4();
    const gameState = createFunctionalGame([]);

    const newGame = {
      id,
      players: [],
      state: gameState,
    };

    const created = await store.add(newGame);
    created.process(broadcast);
    return created;
  }

  // Join game function men pending state kan tilføjes senere
  async function joinGame(gameId: string, name: string, viewerId?: string) {
    const gameRes = await store.game(gameId);
    
    const joined = gameRes.map(game => {
      const id = viewerId ?? uuidv4();

      let player = game.players.find((p: any) => p.id === id);
      if (!player) {
        player = { id, name };
        game.players.push(player);
      }

      const corePlayers = game.players.map((p: any) => ({
        id: p.id,
        name: p.name,
      }));

        const gameState = createFunctionalGame(corePlayers);
        game.state = gameState;
      return { game, viewerId: id };
    });

    const stored = await joined.asyncFlatMap(async ({ game, viewerId }) => {
      const res = await store.update(game);
      return res.map(g => ({ game: g, viewerId }));
    });

    stored.process(({ game }) => broadcast(game));
    return stored;
  }

  async function playCard(gameId: string, playerId: string, cardIndex: number, chosenColor?: string) {
    const game = await update(gameId, playerId, game => {
      const updated = playFunctionalCard(
        game.state,
        cardIndex,
        chosenColor as Color
      );
      const newGame = { ...game, state: updated };
      return newGame;
    });

    game.process(broadcast);
    return game;
  }

  async function drawCard(gameId: string, playerId: string) {
    const game = await update(gameId, playerId, game => {
    const newGame = { ...game, state: drawFunctionalCard(game.state) };
    return newGame;
    });

    game.process(broadcast);
    return game;
  }

  async function sayUNO(gameId: string, playerId: string) {
    const game = await update(gameId, playerId, game => {
    const newGame = { ...game, state: sayUNOFunc(game.state) };
    return newGame;
    });

    game.process(broadcast);
    return game;
  }

  return {
    games,
    game,
    createGame,
    joinGame,
    playCard,
    drawCard,
    sayUNO,
  };
};
