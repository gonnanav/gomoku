import { describe, expect, test } from 'vitest';
import {
  initialGameState,
  placeStone,
  previewOrPlaceStone,
  stateAt,
  statusOf,
  type Coordinate,
} from './game.ts';

// Plays the moves in order, starting from a new game.
function play(...moves: Coordinate[]) {
  return moves.reduce(placeStone, initialGameState);
}

describe('an intersection that had no stone placed on it is empty', () => {
  const empty = expect.objectContaining({ kind: 'empty' });

  test('in a new game', () => {
    expect(stateAt(initialGameState, { row: 0, col: 0 })).toEqual(empty);
  });

  test('when a stone was placed elsewhere', () => {
    const game = placeStone(initialGameState, { row: 0, col: 1 });

    expect(stateAt(game, { row: 0, col: 0 })).toEqual(empty);
  });
});

describe('stones are placed in alternating colors, starting with black', () => {
  const black = expect.objectContaining({ kind: 'black' });
  const white = expect.objectContaining({ kind: 'white' });

  test('when a single stone has been placed', () => {
    const game = placeStone(initialGameState, { row: 0, col: 0 });

    expect(stateAt(game, { row: 0, col: 0 })).toEqual(black);
  });

  test('when four stones have been placed', () => {
    let game = placeStone(initialGameState, { row: 0, col: 0 });
    game = placeStone(game, { row: 0, col: 1 });
    game = placeStone(game, { row: 0, col: 2 });
    game = placeStone(game, { row: 0, col: 3 });

    expect(stateAt(game, { row: 0, col: 0 })).toEqual(black);
    expect(stateAt(game, { row: 0, col: 1 })).toEqual(white);
    expect(stateAt(game, { row: 0, col: 2 })).toEqual(black);
    expect(stateAt(game, { row: 0, col: 3 })).toEqual(white);
  });
});

describe('the turn alternates between the players, starting with black', () => {
  test('in the first turn', () => {
    expect(statusOf(initialGameState)).toHaveProperty('currentColor', 'black');
  });

  test('in the second turn', () => {
    const game = placeStone(initialGameState, { row: 0, col: 0 });

    expect(statusOf(game)).toHaveProperty('currentColor', 'white');
  });

  test('in the third turn', () => {
    let game = placeStone(initialGameState, { row: 0, col: 0 });
    game = placeStone(game, { row: 0, col: 1 });

    expect(statusOf(game)).toHaveProperty('currentColor', 'black');
  });

  test('in the fourth turn', () => {
    let game = placeStone(initialGameState, { row: 0, col: 0 });
    game = placeStone(game, { row: 0, col: 1 });
    game = placeStone(game, { row: 0, col: 2 });

    expect(statusOf(game)).toHaveProperty('currentColor', 'white');
  });
});

describe('an intersection that was played last is marked as the last move', () => {
  test('when it has the only stone on the board', () => {
    const game = placeStone(initialGameState, { row: 0, col: 0 });

    expect(stateAt(game, { row: 0, col: 0 })).toHaveProperty('isLastMove', true);
  });

  test('when it has one of several stones on the board', () => {
    let game = placeStone(initialGameState, { row: 0, col: 0 });
    game = placeStone(game, { row: 0, col: 1 });

    expect(stateAt(game, { row: 0, col: 1 })).toHaveProperty('isLastMove', true);
  });
});

test('an intersection that was not played last is not marked as the last move', () => {
  let game = placeStone(initialGameState, { row: 0, col: 0 });
  game = placeStone(game, { row: 0, col: 1 });

  expect(stateAt(game, { row: 0, col: 0 })).toHaveProperty('isLastMove', false);
});

test('trying to place a stone on an occupied intersection does nothing', () => {
  const game = placeStone(initialGameState, { row: 0, col: 0 });

  expect(placeStone(game, { row: 0, col: 0 })).toBe(game);
});

describe('an intersection that was previewed since the last play is marked as previewed', () => {
  test('when no intersection is previewed', () => {
    const game = previewOrPlaceStone(initialGameState, { row: 0, col: 0 });

    expect(stateAt(game, { row: 0, col: 0 })).toHaveProperty('isPreviewed', true);
  });

  test('when another intersection is already previewed', () => {
    let game = previewOrPlaceStone(initialGameState, { row: 0, col: 0 });
    game = previewOrPlaceStone(game, { row: 0, col: 1 });

    expect(stateAt(game, { row: 0, col: 1 })).toHaveProperty('isPreviewed', true);
  });
});

describe('an intersection that was not previewed since the last play is not marked as previewed', () => {
  test('when it has never been previewed', () => {
    expect(stateAt(initialGameState, { row: 0, col: 0 })).toHaveProperty('isPreviewed', false);
  });

  test('when another intersection was previewed after it', () => {
    let game = previewOrPlaceStone(initialGameState, { row: 0, col: 0 });
    game = previewOrPlaceStone(game, { row: 0, col: 1 });

    expect(stateAt(game, { row: 0, col: 0 })).toHaveProperty('isPreviewed', false);
  });

  test('when a stone was placed after it was previewed', () => {
    let game = previewOrPlaceStone(initialGameState, { row: 0, col: 0 });
    game = placeStone(game, { row: 0, col: 1 });

    expect(stateAt(game, { row: 0, col: 0 })).toHaveProperty('isPreviewed', false);
  });
});

test('previewing and then confirming is the same as placing a stone directly', () => {
  let game = previewOrPlaceStone(initialGameState, { row: 0, col: 0 });
  game = previewOrPlaceStone(game, { row: 0, col: 0 });

  expect(game).toEqual(placeStone(initialGameState, { row: 0, col: 0 }));
});

test('previewing and then placing a stone is the same as placing a stone directly', () => {
  let game = previewOrPlaceStone(initialGameState, { row: 0, col: 0 });
  game = placeStone(game, { row: 0, col: 0 });

  expect(game).toEqual(placeStone(initialGameState, { row: 0, col: 0 }));
});

test('trying to preview an occupied intersection does nothing', () => {
  const game = placeStone(initialGameState, { row: 0, col: 0 });

  expect(previewOrPlaceStone(game, { row: 0, col: 0 })).toBe(game);
});

describe('the player who lines up five stones in a row wins', () => {
  test('horizontally', () => {
    const game = play(
      { row: 7, col: 3 }, { row: 0, col: 0 },
      { row: 7, col: 4 }, { row: 0, col: 1 },
      { row: 7, col: 5 }, { row: 0, col: 2 },
      { row: 7, col: 6 }, { row: 0, col: 3 },
      { row: 7, col: 7 },
    );

    expect(statusOf(game)).toEqual({ kind: 'won', winner: 'black' });
  });

  test('vertically', () => {
    const game = play(
      { row: 3, col: 7 }, { row: 0, col: 0 },
      { row: 4, col: 7 }, { row: 0, col: 1 },
      { row: 5, col: 7 }, { row: 0, col: 2 },
      { row: 6, col: 7 }, { row: 0, col: 3 },
      { row: 7, col: 7 },
    );

    expect(statusOf(game)).toEqual({ kind: 'won', winner: 'black' });
  });

  test('diagonally', () => {
    const game = play(
      { row: 3, col: 3 }, { row: 0, col: 0 },
      { row: 4, col: 4 }, { row: 0, col: 1 },
      { row: 5, col: 5 }, { row: 0, col: 2 },
      { row: 6, col: 6 }, { row: 0, col: 3 },
      { row: 7, col: 7 },
    );

    expect(statusOf(game)).toEqual({ kind: 'won', winner: 'black' });
  });

  test('anti-diagonally', () => {
    const game = play(
      { row: 3, col: 7 }, { row: 0, col: 0 },
      { row: 4, col: 6 }, { row: 0, col: 1 },
      { row: 5, col: 5 }, { row: 0, col: 2 },
      { row: 6, col: 4 }, { row: 0, col: 3 },
      { row: 7, col: 3 },
    );

    expect(statusOf(game)).toEqual({ kind: 'won', winner: 'black' });
  });

  test('as white, too', () => {
    const game = play(
      { row: 0, col: 0 }, { row: 7, col: 3 },
      { row: 0, col: 1 }, { row: 7, col: 4 },
      { row: 0, col: 2 }, { row: 7, col: 5 },
      { row: 0, col: 3 }, { row: 7, col: 6 },
      { row: 2, col: 0 }, { row: 7, col: 7 },
    );

    expect(statusOf(game)).toEqual({ kind: 'won', winner: 'white' });
  });

  test('with more than five in a row', () => {
    const game = play(
      { row: 7, col: 3 }, { row: 0, col: 0 },
      { row: 7, col: 4 }, { row: 0, col: 1 },
      { row: 7, col: 5 }, { row: 0, col: 2 },
      { row: 7, col: 6 }, { row: 0, col: 3 },
      { row: 7, col: 8 }, { row: 2, col: 0 },
      { row: 7, col: 7 },
    );

    expect(statusOf(game)).toEqual({ kind: 'won', winner: 'black' });
  });
});

describe('the game does not change once it has been won', () => {
  // A game black won with five in a row on row 7.
  const game = play(
    { row: 7, col: 3 }, { row: 0, col: 0 },
    { row: 7, col: 4 }, { row: 0, col: 1 },
    { row: 7, col: 5 }, { row: 0, col: 2 },
    { row: 7, col: 6 }, { row: 0, col: 3 },
    { row: 7, col: 7 },
  );

  test('when trying to place a stone', () => {
    expect(placeStone(game, { row: 5, col: 5 })).toBe(game);
  });

  test('when trying to preview an intersection', () => {
    expect(previewOrPlaceStone(game, { row: 5, col: 5 })).toBe(game);
  });
});

describe('the game is still playing while nobody has five in a row', () => {
  test('in a new game', () => {
    expect(statusOf(initialGameState)).toHaveProperty('kind', 'playing');
  });

  test('with only four in a row', () => {
    const game = play(
      { row: 7, col: 3 }, { row: 0, col: 0 },
      { row: 7, col: 4 }, { row: 0, col: 1 },
      { row: 7, col: 5 }, { row: 0, col: 2 },
      { row: 7, col: 6 },
    );

    expect(statusOf(game)).toHaveProperty('kind', 'playing');
  });

  test('with five stones on a line that an opposing stone splits', () => {
    const game = play(
      { row: 7, col: 3 }, { row: 7, col: 5 },
      { row: 7, col: 4 }, { row: 0, col: 0 },
      { row: 7, col: 6 }, { row: 0, col: 1 },
      { row: 7, col: 7 }, { row: 0, col: 2 },
      { row: 7, col: 8 },
    );

    expect(statusOf(game)).toHaveProperty('kind', 'playing');
  });
});
