import { describe, expect, it } from 'vitest';
import { lastIndex, nextCoordinate } from './board.ts';

describe('nextCoordinate', () => {
  it.each([
    { key: 'ArrowUp', from: { row: 7, col: 7 }, to: { row: 6, col: 7 } },
    { key: 'ArrowDown', from: { row: 7, col: 7 }, to: { row: 8, col: 7 } },
    { key: 'ArrowLeft', from: { row: 7, col: 7 }, to: { row: 7, col: 6 } },
    { key: 'ArrowRight', from: { row: 7, col: 7 }, to: { row: 7, col: 8 } },
  ] as const)('$key from ($from.row,$from.col) moves to ($to.row,$to.col)', ({ key, from, to }) => {
    expect(nextCoordinate(from, key)).toEqual(to);
  });

  it.each([
    { key: 'ArrowUp', coordinate: { row: 0, col: 7 } },
    { key: 'ArrowDown', coordinate: { row: lastIndex, col: 7 } },
    { key: 'ArrowLeft', coordinate: { row: 7, col: 0 } },
    { key: 'ArrowRight', coordinate: { row: 7, col: lastIndex } },
  ] as const)('$key from ($coordinate.row,$coordinate.col) stays in place', ({ key, coordinate }) => {
    expect(nextCoordinate(coordinate, key)).toEqual(coordinate);
  });
});
