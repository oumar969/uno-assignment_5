// src/apollo/client.ts
import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

// --- HTTP link (queries & mutations) ---
const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
  headers: {
    "x-player-id": localStorage.getItem("myPlayerId") || "",
  },
});

// --- WebSocket link (subscriptions) ---
const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:4001/graphql",
    connectionParams: () => ({
      "x-player-id": localStorage.getItem("myPlayerId") || "",
    }),
  })
);

// --- Split: subscription = websocket, else = http ---
const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return (
      def.kind === "OperationDefinition" &&
      def.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

// --- Apollo Client instance ---
export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
