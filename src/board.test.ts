import { describe, expect, test } from 'vitest';
import { edgesAt, nextCoordinate, oppositeOf } from './board.ts';

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

describe('oppositeOf', () => {
  test.each([
    ['black', 'white'],
    ['white', 'black'],
  ] as const)('opposite of %j is %j', (color, opposite) => {
    expect(oppositeOf(color)).toBe(opposite);
  });
});
