import { Subject } from "rxjs"
//Use it when we want to push and share events
//Apollo Server with GraphQL subscriptions to receive real-time updates.
const gameEvents$ = new Subject<string>()

gameEvents$.subscribe(v => console.log("UI A:", v))//subscribe to receive events
gameEvents$.subscribe(v => console.log("UI B:", v))

gameEvents$.next("GAME_UPDATED")


// we can use merge for multiple event sources
//if we have multiple event sources we can merge them into one stream
merge(serverEvents$, uiEvents$).subscribe(e => console.log("ALL EVENTS:", e))
