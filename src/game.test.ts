import { describe, expect, test } from 'vitest';
import {
  currentColorOf,
  initialGameState,
  placeStone,
  previewOrPlaceStone,
  stateAt,
} from './game.ts';

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
    expect(currentColorOf(initialGameState)).toBe('black');
  });

  test('in the second turn', () => {
    const game = placeStone(initialGameState, { row: 0, col: 0 });

    expect(currentColorOf(game)).toBe('white');
  });

  test('in the third turn', () => {
    let game = placeStone(initialGameState, { row: 0, col: 0 });
    game = placeStone(game, { row: 0, col: 1 });

    expect(currentColorOf(game)).toBe('black');
  });

  test('in the fourth turn', () => {
    let game = placeStone(initialGameState, { row: 0, col: 0 });
    game = placeStone(game, { row: 0, col: 1 });
    game = placeStone(game, { row: 0, col: 2 });

    expect(currentColorOf(game)).toBe('white');
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
