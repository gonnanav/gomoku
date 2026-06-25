import { useState, type PointerEvent } from 'react';
import clsx from 'clsx';
import classes from './Board.module.css';

type Coordinate = { row: number; col: number };

const size = 15; // intersections per side
const intersections = size * size;
const lastIndex = size - 1;

const initialStones = new Set<string>();

function coordinateKey({ row, col }: Coordinate) {
  return `${row},${col}`;
}

function coordinatesEqual(a: Coordinate, b: Coordinate) {
  return a.row === b.row && a.col === b.col;
}

function useBoard() {
  const [stones, setStones] = useState(initialStones);
  const [previewedStone, setPreviewedStone] = useState<Coordinate | null>(null);

  function isPlaced(coordinate: Coordinate) {
    return stones.has(coordinateKey(coordinate));
  }

  function isPreviewed(coordinate: Coordinate) {
    return previewedStone !== null && coordinatesEqual(previewedStone, coordinate);
  }

  function placeStone(coordinate: Coordinate) {
    setStones((prev) => new Set(prev).add(coordinateKey(coordinate)));
    setPreviewedStone(null);
  }

  function previewStone(coordinate: Coordinate) {
    setPreviewedStone(coordinate);
  }

  function clearPreview() {
    setPreviewedStone(null);
  }

  return { isPlaced, isPreviewed, placeStone, previewStone, clearPreview };
}

function Board() {
  const { isPlaced, isPreviewed, placeStone, previewStone, clearPreview } = useBoard();

  // Clicking previews an intersection; clicking the same one again places a stone.
  // On desktop the pointer hover previews, so a single click places.
  function previewOrPlace(coordinate: Coordinate) {
    if (isPlaced(coordinate)) {
      clearPreview();
    } else if (isPreviewed(coordinate)) {
      placeStone(coordinate);
    } else {
      previewStone(coordinate);
    }
  }

  // Only a mouse hovers, so this previews on desktop without affecting touch taps.
  function handleIntersectionPointerEnter(event: PointerEvent, coordinate: Coordinate) {
    if (event.pointerType !== 'mouse') return;

    if (isPlaced(coordinate)) {
      clearPreview();
    } else {
      previewStone(coordinate);
    }
  }

  function handleBoardPointerLeave(event: PointerEvent) {
    if (event.pointerType !== 'mouse') return;

    clearPreview();
  }

  return (
    <div className={classes.root}>
      <div className={classes.board} onPointerLeave={handleBoardPointerLeave}>
        {Array.from({ length: intersections }, (_, i) => {
          const row = Math.floor(i / size);
          const col = i % size;
          const coordinate = { row, col };

          const edgeTop = row === 0;
          const edgeRight = col === lastIndex;
          const edgeBottom = row === lastIndex;
          const edgeLeft = col === 0;

          const showStone = isPlaced(coordinate) || isPreviewed(coordinate);

          return (
            <div
              key={coordinateKey(coordinate)}
              className={clsx(classes.intersection, {
                [classes.edgeTop]: edgeTop,
                [classes.edgeRight]: edgeRight,
                [classes.edgeBottom]: edgeBottom,
                [classes.edgeLeft]: edgeLeft,
              })}
              onPointerEnter={(event) => handleIntersectionPointerEnter(event, coordinate)}
              onClick={() => previewOrPlace(coordinate)}
            >
              {showStone && (
                <div className={clsx(classes.stone, { [classes.preview]: isPreviewed(coordinate) })} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Board;
