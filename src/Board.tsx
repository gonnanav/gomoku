import { useRef, useState, type KeyboardEvent } from 'react';
import { Intersection } from './Intersection.tsx';
import {
  type Coordinate,
  type IntersectionState,
  boardCoordinates,
  centerCoordinate,
  coordinateKey,
  coordinatesEqual,
  nextCoordinate,
} from './board.ts';
import classes from './Board.module.css';

export function Board() {
  const { stateAt, placeStone, previewOrPlaceStone } = useBoard();
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
      <div className={classes.board}>
        {boardCoordinates.map((coordinate) => (
          <Intersection
            key={coordinateKey(coordinate)}
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

const initialStones = new Set<string>();

function useBoard() {
  const [stones, setStones] = useState(initialStones);
  const [previewedStone, setPreviewedStone] = useState<Coordinate | null>(null);

  function stateAt(coordinate: Coordinate): IntersectionState {
    if (stones.has(coordinateKey(coordinate))) return 'black';
    if (previewedStone !== null && coordinatesEqual(previewedStone, coordinate)) return 'preview';
    return 'empty';
  }

  function placeStone(coordinate: Coordinate) {
    setStones((prev) => new Set(prev).add(coordinateKey(coordinate)));
  }

  function previewOrPlaceStone(coordinate: Coordinate) {
    if (stateAt(coordinate) === 'preview') {
      placeStone(coordinate);
      setPreviewedStone(null);
    } else {
      setPreviewedStone(coordinate);
    }
  }

  return { stateAt, placeStone, previewOrPlaceStone };
}

function useRovingFocus() {
  const [tabStop, setTabStop] = useState<Coordinate>(centerCoordinate);
  const intersectionsRef = useRef(new Map<string, HTMLElement>());

  function registerIntersection(element: HTMLElement | null, coordinate: Coordinate) {
    if (!element) return;
    intersectionsRef.current.set(coordinateKey(coordinate), element);
  }

  function focusIntersection(coordinate: Coordinate) {
    intersectionsRef.current.get(coordinateKey(coordinate))?.focus();
  }

  function tabIndexFor(coordinate: Coordinate) {
    return coordinatesEqual(tabStop, coordinate) ? 0 : -1;
  }

  return { registerIntersection, focusIntersection, tabIndexFor, setTabStop };
}
