import { type CSSProperties, type KeyboardEvent } from 'react';
import clsx from 'clsx';
import { Intersection } from './Intersection.tsx';
import {
  type Coordinate,
  type GameStatus,
  type IntersectionStatus,
  boardSize,
  boardCoordinates,
  keyOf,
} from './game.ts';
import classes from './Board.module.css';

const boardLineIndexes = Array.from({ length: boardSize }, (_, index) => index);
const boardStyle = { '--board-size': boardSize } as CSSProperties;

type BoardProps = {
  className?: string;
  status: GameStatus;
  statusAt: (coordinate: Coordinate) => IntersectionStatus;
  tabIndexFor: (coordinate: Coordinate) => number;
  registerIntersection: (element: HTMLElement | null, coordinate: Coordinate) => void;
  onIntersectionFocus: (coordinate: Coordinate) => void;
  onIntersectionKeyDown: (event: KeyboardEvent, coordinate: Coordinate) => void;
  onIntersectionClick: (coordinate: Coordinate) => void;
};

export function Board({
  className,
  status,
  statusAt,
  tabIndexFor,
  registerIntersection,
  onIntersectionFocus,
  onIntersectionKeyDown,
  onIntersectionClick,
}: BoardProps) {
  const previewColor = status.kind === 'playing' ? status.currentColor : null;

  return (
    <div className={clsx(classes.root, className)} style={boardStyle}>
      <div className={classes.verticalLines} aria-hidden="true">
        {boardLineIndexes.map((index) => (
          <div key={index} className={classes.verticalLine} />
        ))}
      </div>
      <div className={classes.horizontalLines} aria-hidden="true">
        {boardLineIndexes.map((index) => (
          <div key={index} className={classes.horizontalLine} />
        ))}
      </div>
      <div className={classes.intersections}>
        {boardCoordinates.map((coordinate) => (
          <Intersection
            key={keyOf(coordinate)}
            className={classes.intersection}
            coordinate={coordinate}
            status={statusAt(coordinate)}
            previewColor={previewColor}
            tabIndex={tabIndexFor(coordinate)}
            registerElement={registerIntersection}
            onFocus={onIntersectionFocus}
            onKeyDown={onIntersectionKeyDown}
            onClick={onIntersectionClick}
          />
        ))}
      </div>
    </div>
  );
}
