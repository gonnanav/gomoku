export type Coordinate = { readonly x: number; readonly y: number };

export type GameState = {
  readonly moves: readonly Coordinate[];
  readonly previewedStone: Coordinate | null;
};

export const initialGameState: GameState = {
  moves: [],
  previewedStone: null,
};

export function placeStone(game: GameState, coordinate: Coordinate): GameState {
  if (!canPlaceStone(game, coordinate)) return game;

  return {
    moves: [...game.moves, coordinate],
    previewedStone: null,
  };
}

export function previewOrPlaceStone(game: GameState, coordinate: Coordinate): GameState {
  if (!canPlaceStone(game, coordinate)) return game;
  if (isPreviewedAt(game, coordinate)) return placeStone(game, coordinate);

  return { ...game, previewedStone: coordinate };
}

function canPlaceStone(game: GameState, coordinate: Coordinate): boolean {
  return statusOf(game).kind === 'playing' && !stoneColorAt(game, coordinate);
}

export type StoneColor = 'black' | 'white';

export type GameStatus =
  | { readonly kind: 'playing'; readonly currentColor: StoneColor }
  | { readonly kind: 'won'; readonly winner: StoneColor };

export function statusOf(game: GameState): GameStatus {
  const lastMove = lastMoveOf(game);
  if (!lastMove || winningStonesOf(game, lastMove).size === 0) {
    return { kind: 'playing', currentColor: colorOfMove(game.moves.length) };
  }

  // Only the last move can complete a line, so the winner is whoever played it.
  return { kind: 'won', winner: lastMove.color };
}

export type IntersectionStatus =
  | { readonly kind: 'empty'; readonly isPreviewed: boolean }
  | { readonly kind: StoneColor; readonly isLastMove: boolean; readonly isWinning: boolean };

export function statusAt(game: GameState, coordinate: Coordinate): IntersectionStatus {
  const lastMove = lastMoveOf(game);
  const color = stoneColorAt(game, coordinate);

  if (!lastMove || !color) return { kind: 'empty', isPreviewed: isPreviewedAt(game, coordinate) };

  const winningStones = winningStonesOf(game, lastMove);

  return {
    kind: color,
    isLastMove: coordinatesEqual(lastMove.coordinate, coordinate),
    isWinning: winningStones.has(keyOf(coordinate)),
  };
}

function lastMoveOf(game: GameState): Move | undefined {
  const coordinate = game.moves.at(-1);
  if (!coordinate) return undefined;

  return { coordinate, color: colorOfMove(game.moves.length - 1) };
}

function isPreviewedAt(game: GameState, coordinate: Coordinate): boolean {
  return game.previewedStone !== null && coordinatesEqual(game.previewedStone, coordinate);
}

export function keyOf({ x, y }: Coordinate) {
  return `${x},${y}`;
}

export function coordinatesEqual(a: Coordinate, b: Coordinate) {
  return a.x === b.x && a.y === b.y;
}

// Memoizes the stones derived from a moves array, so queries cost O(1) after a
// single O(moves) build per position instead of scanning the moves each time.
const stonesCache = new WeakMap<readonly Coordinate[], ReadonlyMap<string, StoneColor>>();

function stonesOf(game: GameState): ReadonlyMap<string, StoneColor> {
  const cached = stonesCache.get(game.moves);
  if (cached) return cached;

  const stones = new Map(
    game.moves.map((move, moveIndex) => [keyOf(move), colorOfMove(moveIndex)]),
  );
  stonesCache.set(game.moves, stones);

  return stones;
}

function stoneColorAt(game: GameState, coordinate: Coordinate): StoneColor | undefined {
  return stonesOf(game).get(keyOf(coordinate));
}

function colorOfMove(moveIndex: number): StoneColor {
  return moveIndex % 2 === 0 ? 'black' : 'white';
}

type Move = { readonly coordinate: Coordinate; readonly color: StoneColor };

const winningStonesCache = new WeakMap<readonly Coordinate[], ReadonlySet<string>>();

function winningStonesOf(game: GameState, lastMove: Move): ReadonlySet<string> {
  const cached = winningStonesCache.get(game.moves);
  if (cached) return cached;

  const winningStones = new Set<string>();
  const { coordinate, color } = lastMove;

  const forwardSteps = [
    [1, 0], // horizontal
    [0, 1], // vertical
    [1, 1], // diagonal
    [1, -1], // anti-diagonal
  ] as const;

  for (const step of forwardSteps) {
    const [xStep, yStep] = step;
    const backward = consecutiveStonesAfter(game, coordinate, color, [-xStep, -yStep]);
    const forward = consecutiveStonesAfter(game, coordinate, color, step);
    const line = [...backward, coordinate, ...forward];

    if (line.length >= 5) {
      for (const stone of line) winningStones.add(keyOf(stone));
    }
  }

  winningStonesCache.set(game.moves, winningStones);

  return winningStones;
}

function consecutiveStonesAfter(
  game: GameState,
  origin: Coordinate,
  color: StoneColor,
  [xStep, yStep]: readonly [xStep: number, yStep: number],
): Coordinate[] {
  const stones: Coordinate[] = [];
  let coordinate = { x: origin.x + xStep, y: origin.y + yStep };

  while (stoneColorAt(game, coordinate) === color) {
    stones.push(coordinate);
    coordinate = { x: coordinate.x + xStep, y: coordinate.y + yStep };
  }

  return stones;
}

const boardSize = 15; // intersections per side; odd, so the center is an intersection
const radius = (boardSize - 1) / 2; // intersections from the center out to any edge

export const boardCoordinates: Coordinate[] = createBoardCoordinates();

function createBoardCoordinates(): Coordinate[] {
  const coordinates: Coordinate[] = [];

  for (let y = radius; y >= -radius; y--) {
    for (let x = -radius; x <= radius; x++) {
      coordinates.push({ x, y });
    }
  }

  return coordinates;
}

export function edgesAt({ x, y }: Coordinate) {
  return {
    top: y === radius,
    right: x === radius,
    bottom: y === -radius,
    left: x === -radius,
  };
}

export type ArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';

export function nextCoordinate(coordinate: Coordinate, key: ArrowKey): Coordinate {
  switch (key) {
    case 'ArrowUp':
      return { x: coordinate.x, y: clampToBoard(coordinate.y + 1) };
    case 'ArrowDown':
      return { x: coordinate.x, y: clampToBoard(coordinate.y - 1) };
    case 'ArrowLeft':
      return { x: clampToBoard(coordinate.x - 1), y: coordinate.y };
    case 'ArrowRight':
      return { x: clampToBoard(coordinate.x + 1), y: coordinate.y };
  }
}

function clampToBoard(value: number): number {
  return Math.min(Math.max(value, -radius), radius);
}
