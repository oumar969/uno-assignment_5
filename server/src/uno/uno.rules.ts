import { Card, CardType, Color } from "./uno.types"

export function is_match(card: Card, top: Card, active: Color): boolean {
  if (card.color === "wild") return true
  if (card.color === active) return true
  if (card.type === top.type) return true

  return (
    card.type === CardType.Number &&
    top.type === CardType.Number &&
    card.value === top.value
  )
}

/*
import { Card, CardType, Color } from "./uno.types";

export function is_match(card: Card, top: Card, active: Color): boolean {
  const isWildCard = card.color === "wild";
  const isColorMatch = card.color === active;
  const isTypeMatch = card.type === top.type;
  const isNumberMatch =
    card.type === CardType.Number &&
    top.type === CardType.Number &&
    card.value === top.value;

  return isWildCard || isColorMatch || isTypeMatch || isNumberMatch;
}
*/
/*
is_match checks if a played card is valid based on the top card and active color.
*/