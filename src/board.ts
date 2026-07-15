export type Coordinate = { readonly row: number; readonly col: number };
export type StoneColor = 'black' | 'white';
export type IntersectionState = 'empty' | 'preview' | StoneColor;
export type ArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';

export type GameState = {
  readonly stones: ReadonlyMap<string, StoneColor>;
  readonly currentColor: StoneColor;
  readonly previewedStone: Coordinate | null;
};

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

export function edgesAt({ row, col }: Coordinate) {
  return {
    top: row === 0,
    right: col === lastIndex,
    bottom: row === lastIndex,
    left: col === 0,
  };
}

export const initialGameState: GameState = {
  stones: new Map(),
  currentColor: 'black',
  previewedStone: null,
};

export function stateAt(game: GameState, coordinate: Coordinate): IntersectionState {
  const stone = game.stones.get(keyOf(coordinate));
  if (stone) return stone;

  if (game.previewedStone && coordinatesEqual(game.previewedStone, coordinate)) {
    return 'preview';
  }

  return 'empty';
}

export function placeStone(game: GameState, coordinate: Coordinate): GameState {
  if (game.stones.has(keyOf(coordinate))) return game;

  return {
    stones: new Map(game.stones).set(keyOf(coordinate), game.currentColor),
    currentColor: oppositeOf(game.currentColor),
    previewedStone: null,
  };
}

export function previewOrPlaceStone(game: GameState, coordinate: Coordinate): GameState {
  if (stateAt(game, coordinate) === 'empty') {
    return { ...game, previewedStone: coordinate };
  }

  return placeStone(game, coordinate);
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

function oppositeOf(color: StoneColor): StoneColor {
  return color === 'black' ? 'white' : 'black';
}
