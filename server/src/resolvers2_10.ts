import { withFilter } from "graphql-subscriptions";
import { pubsub } from "./pubsub9";
import { PubSubAsyncIterableIterator } from "graphql-subscriptions/dist/pubsub-async-iterable-iterator";
import { GraphQLError } from "graphql";
import { API, ServerError } from "./api3";
import { createAPI } from "./api3";
import { createPubSubBroadcaster } from "./broadcaster8";
import { createInMemoryStore } from "./MemoryStore6";

async function respondWithError(err: ServerError): Promise<never> {
  if (typeof err === 'object' && 'type' in err) {
    throw new GraphQLError(`${err.type}: ${JSON.stringify(err)}`);
  }
  throw new GraphQLError(String(err));
}

export const createResolvers = (api: API) => {
  return {
    Query: {
      async games() {
        const res = await api.games();
        return res.resolve({
          onSuccess: async (games) => games,
          onError: respondWithError,
        });
      },
      async game(_: any, { id }: { id: string }) {
        const res = await api.game(id);
        return res.resolve({
          onSuccess: (game) => game,
          onError: () => undefined,
        });
      },
    },

    Mutation: {
      async createGame() {
        const res = await api.createGame();
        return res.resolve({
          onSuccess: async (game) => game,
          onError: respondWithError,
        });
      },

      async joinGame(_: any, { gameId, name }: any, context: any) {
        const res = await api.joinGame(gameId, name, context.viewerId);
        return res.resolve({
          onSuccess: async(result) => result,
          onError: respondWithError,
        });
      },

      async playCard(
        _: any,
        { gameId, playerId, cardIndex, chosenColor }: any
      ) {
        const res = await api.playCard(gameId, playerId, cardIndex, chosenColor);
        return res.resolve({
          onSuccess: async (game) => game,
          onError: respondWithError,
        });
      },

      async drawCard(_: any, { gameId, playerId }: any) {
        const res = await api.drawCard(gameId, playerId);
        return res.resolve({
          onSuccess: async (game) => game,
          onError: respondWithError,
        });
      },

      async sayUNO(_: any, { gameId, playerId }: any) {
        const res = await api.sayUNO(gameId, playerId);
        return res.resolve({
          onSuccess: async (game) => game,
          onError: respondWithError,
        });
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
        const found = game.players.find((x: any) => x.name === p.name);
        return found ?? null;
      },
      winner: (game: any) => game.state.winner ?? null,
    },

    Player: {
      hand: (player: any, _: any, context: any, info: any) => {
        const game = info.variableValues.id
          ? (async () => {
              const res = await api.game(info.variableValues.id);
              return res.resolve({
                onSuccess: (g) => g,
                onError: () => null,
              });
            })()
          : null;

        if (!game) return [];

        return (async () => {
          const g = await game;
          if (!g) return [];

          const unoPlayer = g.state.players.find(
            (p: any) => p.name === player.name
          );

          if (!unoPlayer) return [];

          if (context.viewerId === player.id) {
            return unoPlayer.hand;
          }

          return unoPlayer.hand.map(() => ({
            color: null,
            type: null,
            value: null,
            back: true,
          }));
        })();
      },

      handCount: (player: any, _: any, __: any, info: any) => {
        return (async () => {
          const res = await api.game(info.variableValues.id);
          return res.resolve({
            onSuccess: (game) => {
              const unoPlayer = game.state.players.find(
                (p: any) => p.name === player.name
              );
              return unoPlayer?.hand.length ?? 0;
            },
            onError: () => 0,
          });
        })();
      },
    },
  };
};

// Create API with dependencies and export resolvers
const store = createInMemoryStore();
const broadcaster = createPubSubBroadcaster(pubsub);
const api = createAPI(broadcaster, store);
export default createResolvers(api);


/*
Query: {
  async resolverName(parent, args, context) {
  parent means the object that contains this field
  args are the arguments passed to the query/mutation
  context is shared between all resolvers, e.g., authentication info
    // logic
  }
}
*/