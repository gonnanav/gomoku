import { type KeyboardEvent } from 'react';
import clsx from 'clsx';
import { type Coordinate, type IntersectionState, edgesAt, keyOf } from './game.ts';
import classes from './Intersection.module.css';

type IntersectionProps = {
  coordinate: Coordinate;
  state: IntersectionState;
  isLastMove: boolean;
  isPreviewed: boolean;
  tabIndex: number;
  registerElement: (element: HTMLElement | null, coordinate: Coordinate) => void;
  onFocus: (coordinate: Coordinate) => void;
  onKeyDown: (event: KeyboardEvent, coordinate: Coordinate) => void;
  onClick: (coordinate: Coordinate) => void;
};

export function Intersection({
  coordinate,
  state,
  isLastMove,
  isPreviewed,
  tabIndex,
  registerElement,
  onFocus,
  onKeyDown,
  onClick,
}: IntersectionProps) {
  const edges = edgesAt(coordinate);

  return (
    <div
      ref={(element) => registerElement(element, coordinate)}
      className={clsx(classes.root, {
        [classes.edgeTop]: edges.top,
        [classes.edgeRight]: edges.right,
        [classes.edgeBottom]: edges.bottom,
        [classes.edgeLeft]: edges.left,
      })}
      data-testid={`intersection-${keyOf(coordinate)}`}
      data-state={state}
      data-last-move={isLastMove ? '' : undefined}
      data-previewed={isPreviewed ? '' : undefined}
      tabIndex={tabIndex}
      onFocus={() => onFocus(coordinate)}
      onKeyDown={(event) => onKeyDown(event, coordinate)}
      onClick={() => onClick(coordinate)}
    >
      <div className={classes.stone} />
    </div>
  );
}
