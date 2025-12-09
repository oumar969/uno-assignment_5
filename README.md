# UNO Assignment (Assignment 5) — Local dev & testing notes

Dette README indeholder hurtige, praktiske instruktioner til at køre projektet lokalt og især hvordan du tester flere spillere (fx 2–3 deltagere) på samme maskine.

## Kort overblik

- Server: `server/` (Apollo GraphQL + websockets)
- Client: `client-react/` (React + Apollo + Redux)
- UNO-core: `server/src/uno/*` (funktionel, immutable implementation)

## Kør projektet

1. Start serveren

```powershell
npm run dev
```

Serveren kører HTTP på `http://localhost:4000/graphql` og websocket-subscriptions på `ws://localhost:4001/graphql`.

2. Start klienten

```powershell
npm run dev
```

Klienten kører normalt på `http://localhost:3000`.

## Hvordan teste flere spillere lokalt (hurtigt)

Klienten gemmer et `viewerId` i `localStorage.myPlayerId` når du joiner et spil. For at simulere flere spillere på samme maskine, skal hver browser-fane/vindue have et forskelligt `localStorage`:

1. Åbn klienten i et almindeligt browser-vindue (A). Opret spil og join som spiller A.
2. Åbn et inkognito/private-vindue (B) eller en anden browser (fx Firefox vs Chrome). Gå til samme klient-URL og join samme spil med et andet navn — B får sit eget `localStorage` og dermed et andet `viewerId`.

Alternativt kan du i DevTools i en eksisterende fane køre:

```js
localStorage.removeItem("myPlayerId");
// genindlæs siden og join igen for at få ny viewerId
```

Bemærk: Hvis du vil teste flere spillere i samme browser-profil uden inkognito, skal du fjerne `myPlayerId` og join igen, eller bruge forskellige browsere.

## Hvorfor dette er nødvendigt

Serveren identificerer klienten ved headeren `x-player-id` (sendes fra klienten til serveren). Hvis to vinduer sender samme `x-player-id`, vil de blive registreret som samme spiller. Derfor skal hver klient have en separat `viewerId`.

## Fejlfinding

- Hvis begge vinduer viser samme spiller: tjek `localStorage.myPlayerId` i begge vinduer (DevTools → Application → Local Storage). De skal være forskellige.
- Hvis subscriptions fejler med `pubsub.asyncIterator is not a function`: genstart serveren; tjek at `server` er startet og at `pubsub`-modulet er korrekt importeret.
- Hvis GameBoard ikke opdaterer: åbn Network/WS i DevTools og bekræft at klienten modtager messages fra websocket.

## Hurtige terminal-kommandoer

- Genstart server:
  ```powershell
  cd server
  npm run dev
  ```
- Genstart client:
  ```powershell
  cd client-react
  npm start
  ```

## Ønsker du en knap i UI til at 'Join as new player'?

Hvis du ofte tester med mange vinduer, kan jeg tilføje en knap i lobby, der fjerner `localStorage.myPlayerId` før `joinGame` mutation, så du nemt kan oprette et nyt spiller-id uden at åbne inkognito.

Sig til hvis du vil have den knap — jeg implementerer den hurtigt.

Denne fil er genereret for at gøre det nemmere at teste multiplayer lokalt. Hvis du vil, kan jeg tilføje samme tekst som en kort note i lobby UI også.
