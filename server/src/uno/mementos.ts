import { Card, CardType, Color, Player, Uno } from "./uno.types";
import { Deck } from "./uno.deck";
import { toMemento as handToMemento, fromMemento as handFromMemento } from "./hand";

// Plain serializable memento types
export type CardMemento = { color: Color; type: CardType; value?: number };
export type DeckMemento = CardMemento[];

export type PlayerMemento = {
  id: string;
  name: string;
  hand: DeckMemento;
  saidUno: boolean;
};

export type UnoMemento = {
  players: PlayerMemento[];
  drawPile: DeckMemento;
  discardPile: DeckMemento;
  currentPlayer: number;
  direction: 1 | -1;
  activeColor: Color;
  winner?: string;
};

export function cardToMemento(c: Card): CardMemento {
  return { color: c.color, type: c.type, value: c.value };
}

export function cardFromMemento(m: CardMemento): Card {
  return { color: m.color, type: m.type as CardType, value: m.value } as Card;
}

export function deckToMemento(deck: Deck): DeckMemento {
  return deck.map(cardToMemento);
}

export function deckFromMemento(m: DeckMemento): Deck {
  return m.map(cardFromMemento) as Deck;
}

export function playerToMemento(player: Player): PlayerMemento {
  return {
    id: player.id,
    name: player.name,
    hand: handToMemento(player.hand as any) as DeckMemento,
    saidUno: (player as any).saidUno ?? false,
  };
}

export function playerFromMemento(m: PlayerMemento): Player {
  return {
    id: m.id,
    name: m.name,
    hand: handFromMemento(m.hand) as any,
    saidUno: m.saidUno,
  } as Player;
}

export function unoToMemento(u: Uno): UnoMemento {
  return {
    players: u.players.map((p: any) => playerToMemento(p)),
    drawPile: deckToMemento(u.drawPile as any),
    discardPile: deckToMemento(u.discardPile as any),
    currentPlayer: u.currentPlayer,
    direction: u.direction,
    activeColor: u.activeColor,
    winner: u.winner,
  };
}

export function unoFromMemento(m: UnoMemento): Uno {
  return {
    players: m.players.map((p) => playerFromMemento(p)) as any,
    drawPile: deckFromMemento(m.drawPile) as any,
    discardPile: deckFromMemento(m.discardPile) as any,
    currentPlayer: m.currentPlayer,
    direction: m.direction,
    activeColor: m.activeColor,
    winner: m.winner,
  } as Uno;
}
