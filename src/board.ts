export type Coordinate = { row: number; col: number };
export type IntersectionState = 'empty' | 'black' | 'preview';
export type ArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';

export const boardSize = 15; // intersections per side
export const lastIndex = boardSize - 1;

export function nextCoordinate(coordinate: Coordinate, key: ArrowKey): Coordinate {
  switch (key) {
    case 'ArrowUp':
      return { row: clampIndex(coordinate.row - 1), col: coordinate.col };
    case 'ArrowDown':
      return { row: clampIndex(coordinate.row + 1), col: coordinate.col };
    case 'ArrowLeft':
      return { row: coordinate.row, col: clampIndex(coordinate.col - 1) };
    case 'ArrowRight':
      return { row: coordinate.row, col: clampIndex(coordinate.col + 1) };
  }
}

function clampIndex(index: number): number {
  return Math.min(Math.max(index, 0), lastIndex);
}
