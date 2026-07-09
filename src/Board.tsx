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
  const [tabStop, setTabStop] = useState<Coordinate>(centerCoordinate);
  const intersectionsRef = useRef(new Map<string, HTMLElement>());

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
      const next = nextCoordinate(coordinate, event.key);
      const nextElement = intersectionsRef.current.get(coordinateKey(next));
      nextElement?.focus();
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

  function registerIntersection(element: HTMLElement | null, coordinate: Coordinate) {
    if (!element) return;
    intersectionsRef.current.set(coordinateKey(coordinate), element);
  }

  return (
    <div className={classes.root}>
      <div className={classes.board}>
        {boardCoordinates.map((coordinate) => {
          const tabIndex = coordinatesEqual(tabStop, coordinate) ? 0 : -1;

          return (
            <Intersection
              key={coordinateKey(coordinate)}
              coordinate={coordinate}
              state={stateAt(coordinate)}
              tabIndex={tabIndex}
              registerElement={registerIntersection}
              onFocus={setTabStop}
              onKeyDown={handleIntersectionKeyDown}
              onClick={handleIntersectionClick}
            />
          );
        })}
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
