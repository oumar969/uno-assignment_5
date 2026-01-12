import { List } from "immutable";
//it gives us persistent data structures (List, Map) we don’t change the old data. We get a new copy instead
import type { Card } from "./uno.types"; 
//immutable List from immutable.js
//persistent immutable data structures like list, map, set
//lightweight immutable proxy for extra safety
export type Hand = List<Card>;

export function createHand(cards: Card[] = []): Hand {
  return List(cards);
}

export function handCount(hand: Hand): number {
  return hand.size;
}

export function addCard(hand: Hand, card: Card): Hand {
  return hand.push(card); // returns new List (no mutation)
}

export function removeCardAt(hand: Hand, index: number): { card: Card; hand: Hand } {
  const card = hand.get(index);
  if (!card) throw new Error("Card not found");
  return { card, hand: hand.delete(index) };
}

export function toArray(hand: Hand): Card[] {
  return hand.toArray();
}
//extra safety for objects,
//If someone tries to change or delete something by mistake, the Proxy throws an error
export function lightwightProxy<T extends object>(obj: T): T {
  return new Proxy(obj, {
    set() { throw new Error("Immutable: cannot modify"); },
    deleteProperty() { throw new Error("Immutable: cannot delete"); },
    defineProperty() { throw new Error("Immutable: cannot redefine"); },
  });
}

export function toMemento(hand: Hand): Array<{ color: string; type: string; value?: number }> {
  return hand.toArray().map((c) => ({ color: c.color, type: c.type, value: c.value }));
}
// toMementoSafe creates a lightweight immutable proxy for extra safety
export function toMementoSafe(hand: Hand) {
  return lightwightProxy(toMemento(hand));
}

// fromMemento creates Hand from memento
export function fromMemento(m: Array<{ color: string; type: string; value?: number }>): Hand {
  return createHand(m.map((c) => ({ color: c.color as any, type: c.type as any, value: c.value })));
}
