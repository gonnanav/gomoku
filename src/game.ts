export type Coordinate = { readonly row: number; readonly col: number };
export type StoneColor = 'black' | 'white';
export type IntersectionState =
  | { readonly kind: 'empty'; readonly isPreviewed: boolean }
  | { readonly kind: StoneColor; readonly isLastMove: boolean };
export type GameStatus =
  | { readonly kind: 'playing'; readonly currentColor: StoneColor }
  | { readonly kind: 'won'; readonly winner: StoneColor };
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

export function statusOf(game: GameState): GameStatus {
  const winner = winnerOf(game);
  if (winner) return { kind: 'won', winner };

  return { kind: 'playing', currentColor: colorOfMove(game.moves.length) };
}

export function stateAt(game: GameState, coordinate: Coordinate): IntersectionState {
  const color = stoneColorAt(game, coordinate);
  if (!color) return { kind: 'empty', isPreviewed: isPreviewedAt(game, coordinate) };

  return { kind: color, isLastMove: isLastMoveAt(game, coordinate) };
}

export function placeStone(game: GameState, coordinate: Coordinate): GameState {
  if (winnerOf(game)) return game;
  if (hasStoneAt(game, coordinate)) return game;

  return {
    moves: [...game.moves, coordinate],
    previewedStone: null,
  };
}

export function previewOrPlaceStone(game: GameState, coordinate: Coordinate): GameState {
  if (winnerOf(game)) return game;
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

function winnerOf(game: GameState): StoneColor | null {
  const lastMove = lastMoveOf(game);
  if (!lastMove) return null;

  const color = stoneColorAt(game, lastMove);
  if (!color) return null;

  const forwardSteps = [
    [0, 1], // horizontal
    [1, 0], // vertical
    [1, 1], // diagonal
    [1, -1], // anti-diagonal
  ] as const;

  const hasWon = forwardSteps.some((step) => {
    const [rowStep, colStep] = step;
    const backward = consecutiveStonesAfter(game, lastMove, color, [-rowStep, -colStep]);
    const forward = consecutiveStonesAfter(game, lastMove, color, step);
    const totalCount = backward.length + 1 + forward.length;

    return totalCount >= 5;
  });

  return hasWon ? color : null;
}

function consecutiveStonesAfter(
  game: GameState,
  origin: Coordinate,
  color: StoneColor,
  [rowStep, colStep]: readonly [rowStep: number, colStep: number],
): Coordinate[] {
  const stones: Coordinate[] = [];
  let coordinate = { row: origin.row + rowStep, col: origin.col + colStep };

  while (stoneColorAt(game, coordinate) === color) {
    stones.push(coordinate);
    coordinate = { row: coordinate.row + rowStep, col: coordinate.col + colStep };
  }

  return stones;
}

function lastMoveOf(game: GameState): Coordinate | undefined {
  return game.moves.at(-1);
}

function isLastMoveAt(game: GameState, coordinate: Coordinate): boolean {
  const lastMove = lastMoveOf(game);

  return lastMove !== undefined && coordinatesEqual(lastMove, coordinate);
}

function isPreviewedAt(game: GameState, coordinate: Coordinate): boolean {
  return game.previewedStone !== null && coordinatesEqual(game.previewedStone, coordinate);
}

function clampIndex(index: number): number {
  return Math.min(Math.max(index, 0), lastIndex);
}
