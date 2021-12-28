export const checkIfDuplicateExists = (arr) => {
  return new Set(arr).size !== arr.length;
};

export const randomCards = (n) => {
  let types = ["basto", "espada", "copa", "oro"];
  let cards = [];

  for (let i = 0; i < n; i++) {
    cards.push({
      valor: Math.floor(Math.random() * (12)) + 1,
      palo: types[Math.floor(Math.random() * 4)],
    });
  }

  let codes = cards.map((carta) => carta.valor + carta.palo);

  if (checkIfDuplicateExists(codes)) {
    return randomCards(n);
  }
  return cards;
};

export const cardsWithOne = (cards) =>
  [cards[0].valor, cards[1].valor, cards[2].valor, cards[3].valor].filter(
    (v) => v == 1 || v > 9
  ).length != 0;