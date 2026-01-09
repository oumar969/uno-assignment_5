// ==============================================================
// Apollo Client Configuration
// ==============================================================
// HTTP: Queries & Mutations with dynamic x-player-id header
// WebSocket: Subscriptions with connectionParams
// setContext: Reads localStorage for auth on every request
// ==============================================================

import { ApolloClient, HttpLink ,InMemoryCache, split} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";


// --- HTTP link (queries & mutations) ---
const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
});

// ----------------------------------------------------------
// Auth Link - Dynamic Headers from localStorage
// ----------------------------------------------------------
const authLink = setContext((_, { headers }) => {
  const playerId = localStorage.getItem("myPlayerId");
  return {
    headers: {
      ...headers,
      "x-player-id": playerId || "",
    },
  };
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
  authLink.concat(httpLink) // Chain authLink before httpLink
);

// --- Apollo Client instance ---
export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
