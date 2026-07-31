import { expect, test } from 'vitest';
import {
  currentColorOf,
  initialGameState,
  isLastMoveAt,
  isPreviewedAt,
  placeStone,
  previewOrPlaceStone,
  stateAt,
} from './game.ts';

test('the game starts with an empty board and black to play', () => {
  expect(stateAt(initialGameState, { row: 0, col: 0 })).toBe('empty');
  expect(stateAt(initialGameState, { row: 7, col: 7 })).toBe('empty');
  expect(currentColorOf(initialGameState)).toBe('black');
});

test('placing the first stone places a single black stone', () => {
  const game = placeStone(initialGameState, { row: 7, col: 7 });

  expect(stateAt(game, { row: 0, col: 0 })).toBe('empty');
  expect(stateAt(game, { row: 7, col: 7 })).toBe('black');
  expect(isLastMoveAt(game, { row: 7, col: 7 })).toBe(true);
  expect(currentColorOf(game)).toBe('white');
});

test('placing the second stone places a single white stone', () => {
  let game = placeStone(initialGameState, { row: 7, col: 7 });
  game = placeStone(game, { row: 7, col: 8 });

  expect(stateAt(game, { row: 7, col: 7 })).toBe('black');
  expect(isLastMoveAt(game, { row: 7, col: 7 })).toBe(false);
  expect(stateAt(game, { row: 7, col: 8 })).toBe('white');
  expect(isLastMoveAt(game, { row: 7, col: 8 })).toBe(true);
  expect(currentColorOf(game)).toBe('black');
});

test('placing the third stone places a black stone again', () => {
  let game = placeStone(initialGameState, { row: 7, col: 7 });
  game = placeStone(game, { row: 7, col: 8 });
  game = placeStone(game, { row: 7, col: 9 });

  expect(stateAt(game, { row: 7, col: 7 })).toBe('black');
  expect(stateAt(game, { row: 7, col: 8 })).toBe('white');
  expect(stateAt(game, { row: 7, col: 9 })).toBe('black');
  expect(isLastMoveAt(game, { row: 7, col: 9 })).toBe(true);
});

test('trying to place a stone on an already occupied intersection does nothing', () => {
  const game = placeStone(initialGameState, { row: 7, col: 7 });

  expect(placeStone(game, { row: 7, col: 7 })).toBe(game);
});

test('previewing an empty intersection marks it as previewed', () => {
  const game = previewOrPlaceStone(initialGameState, { row: 7, col: 7 });

  expect(isPreviewedAt(game, { row: 0, col: 0 })).toBe(false);
  expect(stateAt(game, { row: 7, col: 7 })).toBe('empty');
  expect(isPreviewedAt(game, { row: 7, col: 7 })).toBe(true);
  expect(currentColorOf(game)).toBe('black');
});

test('confirming a placement on a previewed intersection places a stone on it', () => {
  let game = previewOrPlaceStone(initialGameState, { row: 7, col: 7 });
  game = previewOrPlaceStone(game, { row: 7, col: 7 });

  expect(stateAt(game, { row: 7, col: 7 })).toBe('black');
  expect(isLastMoveAt(game, { row: 7, col: 7 })).toBe(true);
  expect(isPreviewedAt(game, { row: 7, col: 7 })).toBe(false);
  expect(currentColorOf(game)).toBe('white');
});

test('previewing another intersection moves the preview', () => {
  let game = previewOrPlaceStone(initialGameState, { row: 7, col: 7 });
  game = previewOrPlaceStone(game, { row: 7, col: 8 });

  expect(isPreviewedAt(game, { row: 7, col: 7 })).toBe(false);
  expect(isPreviewedAt(game, { row: 7, col: 8 })).toBe(true);
});

test('previewing an occupied intersection does nothing', () => {
  const game = placeStone(initialGameState, { row: 7, col: 7 });

  expect(previewOrPlaceStone(game, { row: 7, col: 7 })).toBe(game);
});

test('placing a stone anywhere on the board clears the preview', () => {
  let game = previewOrPlaceStone(initialGameState, { row: 7, col: 7 });
  game = placeStone(game, { row: 7, col: 8 });

  expect(stateAt(game, { row: 7, col: 7 })).toBe('empty');
  expect(isPreviewedAt(game, { row: 7, col: 7 })).toBe(false);
});

test('placing directly on a previewed intersection places a stone on it', () => {
  let game = previewOrPlaceStone(initialGameState, { row: 7, col: 7 });
  game = placeStone(game, { row: 7, col: 7 });

  expect(stateAt(game, { row: 7, col: 7 })).toBe('black');
  expect(isLastMoveAt(game, { row: 7, col: 7 })).toBe(true);
});
