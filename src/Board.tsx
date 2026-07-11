import { useRef, useState, type KeyboardEvent } from 'react';
import { Intersection } from './Intersection.tsx';
import {
  type Coordinate,
  type IntersectionState,
  type StoneColor,
  boardCoordinates,
  centerCoordinate,
  coordinatesEqual,
  keyOf,
  nextCoordinate,
  oppositeOf,
} from './board.ts';
import classes from './Board.module.css';

export function Board() {
  const { stateAt, currentColor, placeStone, previewOrPlaceStone } = useBoard();
  const { registerIntersection, focusIntersection, tabIndexFor, setTabStop } = useRovingFocus();

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
      <div className={classes.board} data-current-color={currentColor}>
        {boardCoordinates.map((coordinate) => (
          <Intersection
            key={keyOf(coordinate)}
            coordinate={coordinate}
            state={stateAt(coordinate)}
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

type UseBoardResult = {
  stateAt: (coordinate: Coordinate) => IntersectionState;
  currentColor: StoneColor;
  placeStone: (coordinate: Coordinate) => void;
  previewOrPlaceStone: (coordinate: Coordinate) => void;
};

const initialStones = new Map<string, StoneColor>();

function useBoard(): UseBoardResult {
  const [stones, setStones] = useState(initialStones);
  const [currentColor, setCurrentColor] = useState<StoneColor>('black');
  const [previewedStone, setPreviewedStone] = useState<Coordinate | null>(null);

  function stateAt(coordinate: Coordinate): IntersectionState {
    const stone = stones.get(keyOf(coordinate));
    if (stone) return stone;
    if (previewedStone !== null && coordinatesEqual(previewedStone, coordinate)) return 'preview';
    return 'empty';
  }

  function placeStone(coordinate: Coordinate) {
    if (stones.has(keyOf(coordinate))) return;
    setStones((prev) => new Map(prev).set(keyOf(coordinate), currentColor));
    setCurrentColor(oppositeOf(currentColor));
  }

  function previewOrPlaceStone(coordinate: Coordinate) {
    if (stateAt(coordinate) === 'preview') {
      placeStone(coordinate);
      setPreviewedStone(null);
    } else {
      setPreviewedStone(coordinate);
    }
  }

  return { stateAt, currentColor, placeStone, previewOrPlaceStone };
}

type UseRovingFocusResult = {
  registerIntersection: (element: HTMLElement | null, coordinate: Coordinate) => void;
  focusIntersection: (coordinate: Coordinate) => void;
  tabIndexFor: (coordinate: Coordinate) => number;
  setTabStop: (coordinate: Coordinate) => void;
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

  return { registerIntersection, focusIntersection, tabIndexFor, setTabStop };
}
