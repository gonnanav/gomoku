export type Coordinate = { readonly row: number; readonly col: number };
export type StoneColor = 'black' | 'white';
export type IntersectionState = 'empty' | 'preview' | StoneColor;
export type ArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';

const boardSize = 15; // intersections per side
const lastIndex = boardSize - 1;
const centerIndex = Math.floor(lastIndex / 2);

export const centerCoordinate: Coordinate = { row: centerIndex, col: centerIndex };

export const boardCoordinates: Coordinate[] = Array.from({ length: boardSize }, (_, row) =>
  Array.from({ length: boardSize }, (_, col): Coordinate => ({ row, col })),
).flat();

export function keyOf({ row, col }: Coordinate) {
  return `${row},${col}`;
}

export function coordinatesEqual(a: Coordinate, b: Coordinate) {
  return a.row === b.row && a.col === b.col;
}

export function oppositeOf(color: StoneColor): StoneColor {
  return color === 'black' ? 'white' : 'black';
}

export function edgesAt({ row, col }: Coordinate) {
  return {
    top: row === 0,
    right: col === lastIndex,
    bottom: row === lastIndex,
    left: col === 0,
  };
}

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
