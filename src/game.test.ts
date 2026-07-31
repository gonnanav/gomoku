import { expect, test } from 'vitest';
import {
  type IntersectionState,
  type StoneColor,
  currentColorOf,
  initialGameState,
  placeStone,
  previewOrPlaceStone,
  stateAt,
} from './game.ts';

// Expected intersection states
const empty: IntersectionState = { kind: 'empty', isPreviewed: false };
const previewed: IntersectionState = { kind: 'empty', isPreviewed: true };

function stone(color: StoneColor): IntersectionState {
  return { kind: 'stone', color, isLastMove: false };
}

function lastStone(color: StoneColor): IntersectionState {
  return { kind: 'stone', color, isLastMove: true };
}

test('the game starts with an empty board and black to play', () => {
  expect(stateAt(initialGameState, { row: 0, col: 0 })).toEqual(empty);
  expect(stateAt(initialGameState, { row: 7, col: 7 })).toEqual(empty);
  expect(currentColorOf(initialGameState)).toBe('black');
});

test('placing the first stone places a single black stone', () => {
  const game = placeStone(initialGameState, { row: 7, col: 7 });

  expect(stateAt(game, { row: 0, col: 0 })).toEqual(empty);
  expect(stateAt(game, { row: 7, col: 7 })).toEqual(lastStone('black'));
  expect(currentColorOf(game)).toBe('white');
});

test('placing the second stone places a single white stone', () => {
  let game = placeStone(initialGameState, { row: 7, col: 7 });
  game = placeStone(game, { row: 7, col: 8 });

  expect(stateAt(game, { row: 7, col: 7 })).toEqual(stone('black'));
  expect(stateAt(game, { row: 7, col: 8 })).toEqual(lastStone('white'));
  expect(currentColorOf(game)).toBe('black');
});

test('placing the third stone places a black stone again', () => {
  let game = placeStone(initialGameState, { row: 7, col: 7 });
  game = placeStone(game, { row: 7, col: 8 });
  game = placeStone(game, { row: 7, col: 9 });

  expect(stateAt(game, { row: 7, col: 7 })).toEqual(stone('black'));
  expect(stateAt(game, { row: 7, col: 8 })).toEqual(stone('white'));
  expect(stateAt(game, { row: 7, col: 9 })).toEqual(lastStone('black'));
});

test('trying to place a stone on an already occupied intersection does nothing', () => {
  const game = placeStone(initialGameState, { row: 7, col: 7 });

  expect(placeStone(game, { row: 7, col: 7 })).toBe(game);
});

test('previewing an empty intersection marks it as previewed', () => {
  const game = previewOrPlaceStone(initialGameState, { row: 7, col: 7 });

  expect(stateAt(game, { row: 0, col: 0 })).toEqual(empty);
  expect(stateAt(game, { row: 7, col: 7 })).toEqual(previewed);
  expect(currentColorOf(game)).toBe('black');
});

test('confirming a placement on a previewed intersection places a stone on it', () => {
  let game = previewOrPlaceStone(initialGameState, { row: 7, col: 7 });
  game = previewOrPlaceStone(game, { row: 7, col: 7 });

  expect(stateAt(game, { row: 0, col: 0 })).toEqual(empty);
  expect(stateAt(game, { row: 7, col: 7 })).toEqual(lastStone('black'));
  expect(currentColorOf(game)).toBe('white');
});

test('previewing another intersection moves the preview', () => {
  let game = previewOrPlaceStone(initialGameState, { row: 7, col: 7 });
  game = previewOrPlaceStone(game, { row: 7, col: 8 });

  expect(stateAt(game, { row: 7, col: 7 })).toEqual(empty);
  expect(stateAt(game, { row: 7, col: 8 })).toEqual(previewed);
});

test('previewing an occupied intersection does nothing', () => {
  const game = placeStone(initialGameState, { row: 7, col: 7 });

  expect(previewOrPlaceStone(game, { row: 7, col: 7 })).toBe(game);
});

test('placing a stone anywhere on the board clears the preview', () => {
  let game = previewOrPlaceStone(initialGameState, { row: 7, col: 7 });
  game = placeStone(game, { row: 7, col: 8 });

  expect(stateAt(game, { row: 7, col: 7 })).toEqual(empty);
});

test('placing directly on a previewed intersection places a stone on it', () => {
  let game = previewOrPlaceStone(initialGameState, { row: 7, col: 7 });
  game = placeStone(game, { row: 7, col: 7 });

  expect(stateAt(game, { row: 7, col: 7 })).toEqual(lastStone('black'));
});
