import { useState } from 'react';
import { Intersection } from './Intersection.tsx';
import { type Coordinate, type IntersectionState, boardSize } from './board.ts';
import classes from './Board.module.css';

const intersections = boardSize * boardSize;
const initialStones = new Set<string>();

export function Board() {
  const { stateAt, placeStone, previewOrPlaceStone } = useBoard();

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
        {Array.from({ length: intersections }, (_, i) => {
          const row = Math.floor(i / boardSize);
          const col = i % boardSize;
          const coordinate = { row, col };

          return (
            <Intersection
              key={coordinateKey(coordinate)}
              coordinate={coordinate}
              state={stateAt(coordinate)}
              onClick={handleIntersectionClick}
            />
          );
        })}
      </div>
    </div>
  );
}

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

function coordinateKey({ row, col }: Coordinate) {
  return `${row},${col}`;
}

function coordinatesEqual(a: Coordinate, b: Coordinate) {
  return a.row === b.row && a.col === b.col;
}
