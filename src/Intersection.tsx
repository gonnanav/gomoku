import { type KeyboardEvent } from 'react';
import clsx from 'clsx';
import { type Coordinate, type IntersectionState, edgesAt, keyOf } from './game.ts';
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
  const edges = edgesAt(coordinate);
  const color = state.kind === 'stone' ? state.color : undefined;
  const isLastMove = state.kind === 'stone' ? state.isLastMove : undefined;
  const isPreviewed = state.kind === 'empty' ? state.isPreviewed : undefined;

  return (
    <div
      ref={(element) => registerElement(element, coordinate)}
      data-testid={`intersection-${keyOf(coordinate)}`}
      className={clsx(classes.root, {
        [classes.edgeTop]: edges.top,
        [classes.edgeRight]: edges.right,
        [classes.edgeBottom]: edges.bottom,
        [classes.edgeLeft]: edges.left,
      })}
      tabIndex={tabIndex}
      onFocus={() => onFocus(coordinate)}
      onKeyDown={(event) => onKeyDown(event, coordinate)}
      onClick={() => onClick(coordinate)}
    >
      <span className="visually-hidden">{color ?? (isPreviewed ? 'previewed' : 'empty')}</span>
      <div
        className={classes.stone}
        aria-hidden
        data-state={state.kind}
        data-color={color}
        data-last-move={isLastMove}
        data-previewed={isPreviewed}
      />
    </div>
  );
}
