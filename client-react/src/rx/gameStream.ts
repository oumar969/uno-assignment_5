import { Observable } from "rxjs";
import { apolloClient } from "../apollo/client";
import { gql } from "@apollo/client";
import { store } from "../redux/store";
import { applyServerEvent } from "../redux/gameSlice";

//rxks is a library for reactive programming using observables, to make it easier to compose asynchronous or callback-based code.
/*
Redux → state
React → view
RxJS → events
FP UNO → reducer-logik på serveren
*/
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
// Starter en RxJS stream der lytter på game updates via GraphQL subscription
export function startGameStream(gameId: string) {
  const observable = new Observable((subscriber) => {
    const sub = apolloClient
      .subscribe({
        query: GAME_UPDATED_SUB,
        variables: { id: gameId },
      })
      .subscribe({
        next: (result) => {
          subscriber.next(result.data.gameUpdated);
        },
        error: (err) => subscriber.error(err),
      });

    return () => sub.unsubscribe();
  });

  // Subscribe RxJS → dispatch to Redux
  observable.subscribe((gameState) => {
    store.dispatch(applyServerEvent(gameState));
  });
}
