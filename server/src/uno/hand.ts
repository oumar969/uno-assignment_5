import { Card } from "./uno.types";

// Pure immutable Hand utilities
export type Hand = readonly Card[];

export function createHand(cards: Card[] = []): Hand {
  return Object.freeze([...cards]) as Hand;
}

export function handCount(hand: Hand): number {
  return hand.length;
}

export function addCard(hand: Hand, card: Card): Hand {
  return Object.freeze([...hand, card]) as Hand;
}

export function removeCardAt(hand: Hand, index: number): { card: Card; hand: Hand } {
  const card = hand[index];
  const newHand = Object.freeze([...hand.slice(0, index), ...hand.slice(index + 1)]) as Hand;
  return { card, hand: newHand };
}

// Memento conversion: plain serializable representation
export function toMemento(hand: Hand): Array<{ color: string; type: string; value?: number }> {
  return hand.map((c) => ({ color: c.color, type: c.type, value: c.value }));
}

export function fromMemento(m: Array<{ color: string; type: string; value?: number }>): Hand {
  return createHand(m.map((c) => ({ color: c.color as any, type: c.type as any, value: c.value })));
}
