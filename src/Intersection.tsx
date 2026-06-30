import { type KeyboardEvent } from 'react';
import clsx from 'clsx';
import { type Coordinate, type IntersectionState, boardSize } from './board.ts';
import classes from './Intersection.module.css';

type IntersectionProps = {
  coordinate: Coordinate;
  state: IntersectionState;
  tabIndex: number;
  onFocus: (coordinate: Coordinate) => void;
  onKeyDown: (event: KeyboardEvent, coordinate: Coordinate) => void;
  onClick: (coordinate: Coordinate) => void;
};

const lastIndex = boardSize - 1;

export function Intersection({ coordinate, state, tabIndex, onFocus, onKeyDown, onClick }: IntersectionProps) {
  const { row, col } = coordinate;

  const edgeTop = row === 0;
  const edgeRight = col === lastIndex;
  const edgeBottom = row === lastIndex;
  const edgeLeft = col === 0;

  const value = state === 'black' ? 'black' : 'empty';

  return (
    <div
      data-testid={`intersection-${row}-${col}`}
      className={clsx(classes.root, {
        [classes.edgeTop]: edgeTop,
        [classes.edgeRight]: edgeRight,
        [classes.edgeBottom]: edgeBottom,
        [classes.edgeLeft]: edgeLeft,
      })}
      tabIndex={tabIndex}
      onFocus={() => onFocus(coordinate)}
      onKeyDown={(event) => onKeyDown(event, coordinate)}
      onClick={() => onClick(coordinate)}
    >
      <span className="visually-hidden">{value}</span>
      <div
        aria-hidden
        className={clsx(classes.stone, {
          [classes.previewed]: state === 'preview',
          [classes.placed]: state === 'black',
        })}
      />
    </div>
  );
}
