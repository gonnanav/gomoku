import { useRef, useState, type KeyboardEvent } from 'react';
import { Intersection } from './Intersection.tsx';
import {
  type Coordinate,
  type GameStatus,
  type IntersectionStatus,
  boardCoordinates,
  coordinatesEqual,
  initialGameState,
  keyOf,
  nextCoordinate,
  placeStone,
  previewOrPlaceStone,
  statusAt,
  statusOf,
} from './game.ts';
import classes from './Board.module.css';

export function Board() {
  const { status, statusAt, placeStone, previewOrPlaceStone } = useGame();
  const { registerIntersection, focusIntersection, tabIndexFor, setTabStop } = useRovingFocus();
  const previewColor = status.kind === 'playing' ? status.currentColor : null;

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
    <div className={classes.root}>
      <div className={classes.board}>
        {boardCoordinates.map((coordinate) => (
          <Intersection
            key={keyOf(coordinate)}
            coordinate={coordinate}
            status={statusAt(coordinate)}
            previewColor={previewColor}
            tabIndex={tabIndexFor(coordinate)}
            registerElement={registerIntersection}
            onFocus={setTabStop}
            onKeyDown={handleIntersectionKeyDown}
            onClick={handleIntersectionClick}
          />
        ))}
      </div>
    </div>
  );
}

type UseGameResult = {
  status: GameStatus;
  statusAt: (coordinate: Coordinate) => IntersectionStatus;
  placeStone: (coordinate: Coordinate) => void;
  previewOrPlaceStone: (coordinate: Coordinate) => void;
};

function useGame(): UseGameResult {
  const [game, setGame] = useState(initialGameState);

  return {
    status: statusOf(game),
    statusAt: (coordinate) => statusAt(game, coordinate),
    placeStone: (coordinate) => setGame((prev) => placeStone(prev, coordinate)),
    previewOrPlaceStone: (coordinate) => setGame((prev) => previewOrPlaceStone(prev, coordinate)),
  };
}

type UseRovingFocusResult = {
  registerIntersection: (element: HTMLElement | null, coordinate: Coordinate) => void;
  focusIntersection: (coordinate: Coordinate) => void;
  tabIndexFor: (coordinate: Coordinate) => number;
  setTabStop: (coordinate: Coordinate) => void;
};

function useRovingFocus(): UseRovingFocusResult {
  const [tabStop, setTabStop] = useState<Coordinate>({ x: 0, y: 0 });
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

  return { registerIntersection, focusIntersection, tabIndexFor, setTabStop };
}
