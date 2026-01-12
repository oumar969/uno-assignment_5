
// Currying: a function that returns another function(putting arguments one at a time)
const setWinner = (winner: string) => (game: { winner?: string }) => ({
  ...game,
  winner, // new object, no mutation
});

const game1 = { winner: undefined };
const game2 = setWinner("Ali")(game1);

console.log(game1);
console.log(game2);

//

import * as _ from "lodash/fp";

const setWinner1 = _.set("winner");     // (winner) => (game) => newGame
const setWinnerAli = setWinner1("Ali"); // (game) => newGame

const game11 = { winner: null, direction: 1 };
const game22 = setWinnerAli(game11);

console.log(game11); // unchanged
console.log(game22); // winner is "Ali"
