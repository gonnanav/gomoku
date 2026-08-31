import { useRef, useState, type KeyboardEvent } from 'react';
import { Board } from './Board.tsx';
import { NewGameButton } from './NewGameButton.tsx';
import {
  type Coordinate,
  type GameStatus,
  type IntersectionStatus,
  coordinatesEqual,
  initialGameState,
  keyOf,
  nextCoordinate,
  placeStone,
  previewOrPlaceStone,
  statusAt,
  statusOf,
} from './game.ts';
import clsx from 'clsx';
import classes from './Game.module.css';

const centerCoordinate: Coordinate = { x: 0, y: 0 };

type GameProps = {
  className?: string;
}

export function Game({ className }: GameProps) {
  const { status, statusAt, placeStone, previewOrPlaceStone, resetGame } = useGame();
  const {
    registerIntersection,
    focusIntersection,
    tabIndexFor,
    setTabStop,
    resetTabStop,
  } = useRovingFocus();

  function handleNewGame() {
    resetGame();
    resetTabStop();
  }

  function handleIntersectionKeyDown(event: KeyboardEvent, coordinate: Coordinate) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      placeStone(coordinate);
      return;
    }

    if (
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight'
    ) {
      event.preventDefault();
      focusIntersection(nextCoordinate(coordinate, event.key));
    }
  }

  // On mobile (no hover), first tap previews and second tap places.
  function handleIntersectionClick(coordinate: Coordinate) {
    if (window.matchMedia('(hover: hover)').matches) {
      placeStone(coordinate);
    } else {
      previewOrPlaceStone(coordinate);
    }
  }

  return (
    <div className={clsx(classes.root, className)}>
      <NewGameButton className={classes.newGameButton} onClick={handleNewGame} />
      <Board
        className={classes.board}
        status={status}
        statusAt={statusAt}
        tabIndexFor={tabIndexFor}
        registerIntersection={registerIntersection}
        onIntersectionFocus={setTabStop}
        onIntersectionKeyDown={handleIntersectionKeyDown}
        onIntersectionClick={handleIntersectionClick}
      />
    </div>
  );
}

type UseGameResult = {
  status: GameStatus;
  statusAt: (coordinate: Coordinate) => IntersectionStatus;
  placeStone: (coordinate: Coordinate) => void;
  previewOrPlaceStone: (coordinate: Coordinate) => void;
  resetGame: () => void;
};

function useGame(): UseGameResult {
  const [game, setGame] = useState(initialGameState);

  return {
    status: statusOf(game),
    statusAt: (coordinate) => statusAt(game, coordinate),
    placeStone: (coordinate) => setGame((prev) => placeStone(prev, coordinate)),
    previewOrPlaceStone: (coordinate) => setGame((prev) => previewOrPlaceStone(prev, coordinate)),
    resetGame: () => setGame(initialGameState),
  };
}

type UseRovingFocusResult = {
  registerIntersection: (element: HTMLElement | null, coordinate: Coordinate) => void;
  focusIntersection: (coordinate: Coordinate) => void;
  tabIndexFor: (coordinate: Coordinate) => number;
  setTabStop: (coordinate: Coordinate) => void;
  resetTabStop: () => void;
};

function useRovingFocus(): UseRovingFocusResult {
  const [tabStop, setTabStop] = useState<Coordinate>(centerCoordinate);
  const intersectionsRef = useRef(new Map<string, HTMLElement>());

  function registerIntersection(element: HTMLElement | null, coordinate: Coordinate) {
    if (!element) return;
    intersectionsRef.current.set(keyOf(coordinate), element);
  }

  function focusIntersection(coordinate: Coordinate) {
    intersectionsRef.current.get(keyOf(coordinate))?.focus();
  }

  function tabIndexFor(coordinate: Coordinate) {
    return coordinatesEqual(tabStop, coordinate) ? 0 : -1;
  }

  function resetTabStop() {
    setTabStop(centerCoordinate);
  }

  return { registerIntersection, focusIntersection, tabIndexFor, setTabStop, resetTabStop };
}
