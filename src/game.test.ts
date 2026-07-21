import { describe, expect, test } from 'vitest';
import {
  type IntersectionState,
  type StoneColor,
  currentColorOf,
  edgesAt,
  initialGameState,
  nextCoordinate,
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

describe('game state', () => {
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
});

describe('nextCoordinate', () => {
  test.each([
    { key: 'ArrowUp', from: { row: 7, col: 7 }, to: { row: 6, col: 7 } },
    { key: 'ArrowDown', from: { row: 7, col: 7 }, to: { row: 8, col: 7 } },
    { key: 'ArrowLeft', from: { row: 7, col: 7 }, to: { row: 7, col: 6 } },
    { key: 'ArrowRight', from: { row: 7, col: 7 }, to: { row: 7, col: 8 } },
  ] as const)('$key from ($from.row,$from.col) moves to ($to.row,$to.col)', ({ key, from, to }) => {
    expect(nextCoordinate(from, key)).toEqual(to);
  });

  test.each([
    { key: 'ArrowUp', coordinate: { row: 0, col: 7 } },
    { key: 'ArrowDown', coordinate: { row: 14, col: 7 } },
    { key: 'ArrowLeft', coordinate: { row: 7, col: 0 } },
    { key: 'ArrowRight', coordinate: { row: 7, col: 14 } },
  ] as const)('$key from ($coordinate.row,$coordinate.col) stays in place', ({ key, coordinate }) => {
    expect(nextCoordinate(coordinate, key)).toEqual(coordinate);
  });
});

describe('edgesAt', () => {
  test.each([
    [7, 7, { top: false, right: false, bottom: false, left: false }],
    [0, 7, { top: true, right: false, bottom: false, left: false }],
    [0, 0, { top: true, right: false, bottom: false, left: true }],
    [14, 14, { top: false, right: true, bottom: true, left: false }],
  ] as const)('edges of coordinate (%d,%d) are %j', (row, col, edges) => {
    expect(edgesAt({ row, col })).toEqual(edges);
  });
});
