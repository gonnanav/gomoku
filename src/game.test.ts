import { describe, expect, test } from 'vitest';
import {
  currentColorOf,
  initialGameState,
  isLastMoveAt,
  isPreviewedAt,
  placeStone,
  previewOrPlaceStone,
  stateAt,
} from './game.ts';

describe('an intersection that had no stone placed on it is empty', () => {
  test('in a new game', () => {
    expect(stateAt(initialGameState, { row: 0, col: 0 })).toBe('empty');
  });

  test('when a stone was placed elsewhere', () => {
    const game = placeStone(initialGameState, { row: 0, col: 1 });

    expect(stateAt(game, { row: 0, col: 0 })).toBe('empty');
  });
});

describe('stones are placed in alternating colors, starting with black', () => {
  test('when a single stone has been placed', () => {
    const game = placeStone(initialGameState, { row: 0, col: 0 });

    expect(stateAt(game, { row: 0, col: 0 })).toBe('black');
  });

  test('when four stones have been placed', () => {
    let game = placeStone(initialGameState, { row: 0, col: 0 });
    game = placeStone(game, { row: 0, col: 1 });
    game = placeStone(game, { row: 0, col: 2 });
    game = placeStone(game, { row: 0, col: 3 });

    expect(stateAt(game, { row: 0, col: 0 })).toBe('black');
    expect(stateAt(game, { row: 0, col: 1 })).toBe('white');
    expect(stateAt(game, { row: 0, col: 2 })).toBe('black');
    expect(stateAt(game, { row: 0, col: 3 })).toBe('white');
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

describe('an intersection that has the most recently placed stone is marked as the last move', () => {
  test('when it has the only stone on the board', () => {
    const game = placeStone(initialGameState, { row: 0, col: 0 });

    expect(isLastMoveAt(game, { row: 0, col: 0 })).toBe(true);
  });

  test('when it has one of several stones on the board', () => {
    let game = placeStone(initialGameState, { row: 0, col: 0 });
    game = placeStone(game, { row: 0, col: 1 });

    expect(isLastMoveAt(game, { row: 0, col: 1 })).toBe(true);
  });
});

describe('an intersection that does not have the most recently placed stone is not marked as the last move', () => {
  test('when no moves have been made yet', () => {
    expect(isLastMoveAt(initialGameState, { row: 0, col: 0 })).toBe(false);
  });

  test('when another stone was placed after it', () => {
    let game = placeStone(initialGameState, { row: 0, col: 0 });
    game = placeStone(game, { row: 0, col: 1 });

    expect(isLastMoveAt(game, { row: 0, col: 0 })).toBe(false);
  });

  test('when it is empty', () => {
    const game = placeStone(initialGameState, { row: 0, col: 0 });

    expect(isLastMoveAt(game, { row: 0, col: 1 })).toBe(false);
  });
});

test('trying to place a stone on an occupied intersection does nothing', () => {
  const game = placeStone(initialGameState, { row: 0, col: 0 });

  expect(placeStone(game, { row: 0, col: 0 })).toBe(game);
});

describe('previewing an intersection marks it as previewed without placing a stone', () => {
  test('when no intersection is previewed', () => {
    const game = previewOrPlaceStone(initialGameState, { row: 0, col: 0 });

    expect(isPreviewedAt(game, { row: 0, col: 0 })).toBe(true);
    expect(stateAt(game, { row: 0, col: 0 })).toBe('empty');
  });

  test('when another intersection is already previewed', () => {
    let game = previewOrPlaceStone(initialGameState, { row: 0, col: 0 });
    game = previewOrPlaceStone(game, { row: 0, col: 1 });

    expect(isPreviewedAt(game, { row: 0, col: 1 })).toBe(true);
    expect(stateAt(game, { row: 0, col: 1 })).toBe('empty');
  });
});

describe('an intersection that was not previewed since the last play is not marked as previewed', () => {
  test('when it has never been previewed', () => {
    expect(isPreviewedAt(initialGameState, { row: 0, col: 0 })).toBe(false);
  });

  test('when another intersection was previewed after it', () => {
    let game = previewOrPlaceStone(initialGameState, { row: 0, col: 0 });
    game = previewOrPlaceStone(game, { row: 0, col: 1 });

    expect(isPreviewedAt(game, { row: 0, col: 0 })).toBe(false);
  });

  test('when a stone was placed after it was previewed', () => {
    let game = previewOrPlaceStone(initialGameState, { row: 0, col: 0 });
    game = placeStone(game, { row: 0, col: 1 });

    expect(isPreviewedAt(game, { row: 0, col: 0 })).toBe(false);
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
