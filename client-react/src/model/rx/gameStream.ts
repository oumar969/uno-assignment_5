import { Observable } from "rxjs";
import { apolloClient } from "../apollo/client";
import { gql } from "@apollo/client";
import { store } from "../../stores/store1";
import { applyServerEvent } from "../../slices(Redux)/gameSlice";
import { toGame, GraphQLGame } from "../mappers";

// GraphQL Subscription
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

// Creates Observable from GraphQL subscription
//observable represents a stream of data that can be observed over time
export function startGameStream(gameId: string) {
  const observable = new Observable<GraphQLGame>((subscriber) => {
    const sub = apolloClient.subscribe<{ gameUpdated: GraphQLGame }>({
        query: GAME_UPDATED_SUB,
        variables: { id: gameId },
      })
      .subscribe({
        //next handler for incoming data
        next: (result) => {
          if (result.data) {
            subscriber.next(result.data.gameUpdated);
          }
        },
        error: (err) => subscriber.error(err),
      });

    return () => sub.unsubscribe();
  });
  // Subscribe to the observable and dispatch updates to Redux store
  // Dispatches updates to Redux via applyServerEvent
    observable.subscribe((gameState) => {
    store.dispatch(applyServerEvent(toGame(gameState)));
  });
}
