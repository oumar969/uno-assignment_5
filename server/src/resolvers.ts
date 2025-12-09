import { v4 as uuidv4 } from "uuid";
import { withFilter } from "graphql-subscriptions";
import { pubsub } from "./pubsub";
import { PubSubAsyncIterableIterator } from "graphql-subscriptions/dist/pubsub-async-iterable-iterator";

import {
  createFunctionalGame,
  playFunctionalCard,
  drawFunctionalCard,
  sayUNO,
  Color,
} from "../src/uno/index";

const games: any[] = [];

const resolvers = {
  Query: {
    games: () => games,
    game: (_: any, { id }: { id: string }) => games.find((g) => g.id === id),
  },

  Mutation: {
    createGame: () => {
      const id = uuidv4();

      // funktionelt UNO-spil oprettes
      const gameState = createFunctionalGame([]);

      const game = {
        id,
        players: [], // GraphQL-brugere (viewer name / id)
        state: gameState, // hele UNO-state ligger her
      };

      games.push(game);
      return game;
    },

    joinGame: (_: any, { gameId, name }: any, context: any) => {
      const game = games.find((g) => g.id === gameId);
      if (!game) throw new Error("Game not found");

      const viewerId = context.viewerId ?? uuidv4();

      // registrér spilleren i GraphQL-listen (ingen UNO-hånd her)
      let player = game.players.find((p: any) => p.id === viewerId);
      if (!player) {
        player = { id: viewerId, name };
        game.players.push(player);
      }

      // UNO motoren kender KUN navnene → rebuild funktionel state
      const corePlayers = game.players.map((p: any) => ({
  id: p.id,
  name: p.name,
}));

game.state = createFunctionalGame(corePlayers);


      pubsub.publish("GAME_UPDATED", { gameUpdated: game });

      return { game, viewerId };
    },

    playCard: (_: any, { gameId, playerId, cardIndex, chosenColor }: any) => {
      const game = games.find((g) => g.id === gameId);
      if (!game) throw new Error("Game not found");

      const player = game.players.find((p: any) => p.id === playerId);
      if (!player) throw new Error("Player not found");

      // kontroller tur
      const currentPlayer = game.state.players[game.state.currentPlayer];
      if (currentPlayer.name !== player.name)
        throw new Error("Not your turn!");

      // opdater state
      const updated = playFunctionalCard(
        game.state,
        cardIndex,
        chosenColor as Color
      );

      game.state = updated;

      pubsub.publish("GAME_UPDATED", { gameUpdated: game });

      return game;
    },

    drawCard: (_: any, { gameId, playerId }: any) => {
      const game = games.find((g) => g.id === gameId);
      if (!game) throw new Error("Game not found");

      const player = game.players.find((p: any) => p.id === playerId);
      if (!player) throw new Error("Player not found");

      const currentPlayer = game.state.players[game.state.currentPlayer];
      if (currentPlayer.name !== player.name)
        throw new Error("Not your turn!");

      game.state = drawFunctionalCard(game.state);

      pubsub.publish("GAME_UPDATED", { gameUpdated: game });

      return game;
    },

    sayUNO: (_: any, { gameId, playerId }: any) => {
      const game = games.find((g) => g.id === gameId);
      if (!game) throw new Error("Game not found");

      const player = game.players.find((p: any) => p.id === playerId);
      if (!player) throw new Error("Player not found");

      game.state = sayUNO(game.state);

      pubsub.publish("GAME_UPDATED", { gameUpdated: game });

      return game;
    },
  },

  Subscription: {
    gameUpdated: {
      subscribe: withFilter(
        () => new PubSubAsyncIterableIterator(pubsub as any, "GAME_UPDATED"),
        (payload, variables) => payload.gameUpdated.id === variables.id
      ),
    },
  },
  Game: {
    players: (game: any) => game.players,

    topCard: (game: any) => {
      const top = game.state.discardPile.at(-1);
      if (!top) return null;
      return top;
    },

    activeColor: (game: any) => game.state.activeColor,
    direction: (game: any) => game.state.direction,
    currentPlayer: (game: any) => {
      const p = game.state.players[game.state.currentPlayer];
      if (!p) return null;
      // returnér som GraphQL Player
      const found = game.players.find((x: any) => x.name === p.name);
      return found ?? null;
    },

    winner: (game: any) => game.state.winner ?? null,
  },

  Player: {
    hand: (player: any, _: any, context: any, info: any) => {
      const game = info.variableValues.id
        ? games.find((g) => g.id === info.variableValues.id)
        : null;

      if (!game) return [];

      const unoPlayer = game.state.players.find((p: any) => p.name === player.name);

      if (!unoPlayer) return [];

      // Se egen hånd → returnér kort
      if (context.viewerId === player.id) {
        return unoPlayer.hand;
      }

      // Andre spillere → returnér bagsider (markér back=true)
      return unoPlayer.hand.map(() => ({ color: null, type: null, value: null, back: true }));
    },

    handCount: (player: any, _: any, __: any, info: any) => {
      const game = games.find((g) => g.id === info.variableValues.id);
      if (!game) return 0;

      const unoPlayer = game.state.players.find((p: any) => p.name === player.name);
      return unoPlayer?.hand.length ?? 0;
    },
  },
};

export default resolvers;
