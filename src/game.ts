export type Coordinate = { readonly row: number; readonly col: number };
export type StoneColor = 'black' | 'white';
export type IntersectionState =
  | { readonly kind: 'empty'; readonly isPreviewed: boolean }
  | { readonly kind: 'stone'; readonly color: StoneColor; readonly isLastMove: boolean };
export type ArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';

export type GameState = {
  readonly moves: readonly Coordinate[];
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
  moves: [],
  previewedStone: null,
};

export function currentColorOf(game: GameState): StoneColor {
  return colorOfMove(game.moves.length);
}

export function stateAt(game: GameState, coordinate: Coordinate): IntersectionState {
  const color = stoneColorAt(game, coordinate);
  if (!color) return { kind: 'empty', isPreviewed: isPreviewedAt(game, coordinate) };

  return { kind: 'stone', color, isLastMove: isLastMoveAt(game, coordinate) };
}

export function placeStone(game: GameState, coordinate: Coordinate): GameState {
  if (hasStoneAt(game, coordinate)) return game;

  return {
    moves: [...game.moves, coordinate],
    previewedStone: null,
  };
}

export function previewOrPlaceStone(game: GameState, coordinate: Coordinate): GameState {
  if (hasStoneAt(game, coordinate)) return game;
  if (isPreviewedAt(game, coordinate)) return placeStone(game, coordinate);

  return { ...game, previewedStone: coordinate };
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

// Memoizes the stones derived from a moves array, so queries cost O(1) after a
// single O(moves) build per position instead of scanning the moves each time.
const stonesCache = new WeakMap<readonly Coordinate[], ReadonlyMap<string, StoneColor>>();

function stonesOf(game: GameState): ReadonlyMap<string, StoneColor> {
  let stones = stonesCache.get(game.moves);

  if (!stones) {
    stones = new Map(game.moves.map((move, moveIndex) => [keyOf(move), colorOfMove(moveIndex)]));
    stonesCache.set(game.moves, stones);
  }

  return stones;
}

function stoneColorAt(game: GameState, coordinate: Coordinate): StoneColor | undefined {
  return stonesOf(game).get(keyOf(coordinate));
}

function hasStoneAt(game: GameState, coordinate: Coordinate): boolean {
  return stonesOf(game).has(keyOf(coordinate));
}

function colorOfMove(moveIndex: number): StoneColor {
  return moveIndex % 2 === 0 ? 'black' : 'white';
}

function isLastMoveAt(game: GameState, coordinate: Coordinate): boolean {
  const lastMove = game.moves.at(-1);

  return lastMove !== undefined && coordinatesEqual(lastMove, coordinate);
}

function isPreviewedAt(game: GameState, coordinate: Coordinate): boolean {
  return game.previewedStone !== null && coordinatesEqual(game.previewedStone, coordinate);
}

function clampIndex(index: number): number {
  return Math.min(Math.max(index, 0), lastIndex);
}
