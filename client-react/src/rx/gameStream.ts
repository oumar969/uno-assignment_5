// ==============================================================
// RxJS Game Stream
// ==============================================================
// Wraps GraphQL subscription in RxJS Observable
// Dispatches server events to Redux store
// Architecture:
//   GraphQL Subscription → RxJS Observable → Redux Store
// ==============================================================

import { Observable } from "rxjs";
import { apolloClient } from "../apollo/client";
import { gql } from "@apollo/client";
import { store } from "../redux/store";
import { applyServerEvent } from "../redux/gameSlice";
import { toGame, GraphQLGame } from "../model/mappers";
// ----------------------------------------------------------
// GraphQL Subscription
// ----------------------------------------------------------
const GAME_UPDATED_SUB = gql`
  subscription OnGameUpdated($id: ID!) {
    gameUpdated(id: $id) {
      id
      winner
      activeColor
      direction
      currentPlayer { id name }
      topCard { color type value }
      players {
        id
        name
        handCount
        hand { color type value back }
      }
    }
  }
`;

// ----------------------------------------------------------
// Start RxJS Stream for Game Updates
// ----------------------------------------------------------
// Creates Observable from GraphQL subscription
// Dispatches updates to Redux via applyServerEvent
// ----------------------------------------------------------
export function startGameStream(gameId: string) {
  const observable = new Observable<GraphQLGame>((subscriber) => {
    const sub = apolloClient
      .subscribe<{ gameUpdated: GraphQLGame }>({
        query: GAME_UPDATED_SUB,
        variables: { id: gameId },
      })
      .subscribe({
        next: (result) => {
          if (result.data) {
            subscriber.next(result.data.gameUpdated);
          }
        },
        error: (err) => subscriber.error(err),
      });

    return () => sub.unsubscribe();
  });

  observable.subscribe((gameState) => {
    store.dispatch(applyServerEvent(toGame(gameState)));
  });
}
