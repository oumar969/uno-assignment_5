import { PubSub } from "graphql-subscriptions";
import { ServerGame } from "./servermodel5";

export interface Broadcaster {
  send: (message: ServerGame) => Promise<void>;
}

export const createPubSubBroadcaster = (pubsub: PubSub): Broadcaster => {
  return {
    async send(message: ServerGame) {
      pubsub.publish("GAME_UPDATED", { gameUpdated: message });
    },
  };
};
