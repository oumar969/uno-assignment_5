import { new_uno, play_card, draw_card, say_uno } from "./uno.game(h-o-f)"

export function createFunctionalGame(players: { id: string; name: string }[]) {
  return new_uno(players)
}

export function playFunctionalCard(game: any, index: number, chosenColor: string | null) {
  return play_card(index, chosenColor as any, game)
}

export function drawFunctionalCard(game: any) {
  return draw_card(game)
}

export function sayUNO(game: any) {
  return say_uno(game)
}

export { Color } from "./uno.types"
export { CardType } from "./uno.types"
export { Card } from "./uno.types"
export { Player } from "./uno.types"
export { Uno } from "./uno.types"
