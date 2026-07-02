import { type KeyboardEvent } from 'react';
import clsx from 'clsx';
import { type Coordinate, type IntersectionState, lastIndex } from './board.ts';
import classes from './Intersection.module.css';

type IntersectionProps = {
  coordinate: Coordinate;
  state: IntersectionState;
  tabIndex: number;
  registerElement: (element: HTMLElement | null, coordinate: Coordinate) => void;
  onFocus: (coordinate: Coordinate) => void;
  onKeyDown: (event: KeyboardEvent, coordinate: Coordinate) => void;
  onClick: (coordinate: Coordinate) => void;
};

export function Intersection({
  coordinate,
  state,
  tabIndex,
  registerElement,
  onFocus,
  onKeyDown,
  onClick,
}: IntersectionProps) {
  const { row, col } = coordinate;

  const edgeTop = row === 0;
  const edgeRight = col === lastIndex;
  const edgeBottom = row === lastIndex;
  const edgeLeft = col === 0;

  return (
    <div
      ref={(element) => registerElement(element, coordinate)}
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
      <span className="visually-hidden">{state}</span>
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
