import { type KeyboardEvent } from 'react';
import clsx from 'clsx';
import { type Coordinate, type IntersectionState, type StoneColor, edgesAt, keyOf } from './game.ts';
import classes from './Intersection.module.css';

type IntersectionProps = {
  coordinate: Coordinate;
  state: IntersectionState;
  previewColor: StoneColor | null;
  tabIndex: number;
  registerElement: (element: HTMLElement | null, coordinate: Coordinate) => void;
  onFocus: (coordinate: Coordinate) => void;
  onKeyDown: (event: KeyboardEvent, coordinate: Coordinate) => void;
  onClick: (coordinate: Coordinate) => void;
};

export function Intersection({
  coordinate,
  state,
  previewColor,
  tabIndex,
  registerElement,
  onFocus,
  onKeyDown,
  onClick,
}: IntersectionProps) {
  const edges = edgesAt(coordinate);
  const isLastMove = state.kind !== 'empty' && state.isLastMove;
  const isPreviewed = state.kind === 'empty' && state.isPreviewed;
  const isWinning = state.kind !== 'empty' && state.isWinning;

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
      data-state={state.kind}
      data-last-move={isLastMove ? '' : undefined}
      data-previewed={isPreviewed ? '' : undefined}
      data-winning={isWinning ? '' : undefined}
      data-preview-color={state.kind === 'empty' ? previewColor : undefined}
      tabIndex={tabIndex}
      onFocus={() => onFocus(coordinate)}
      onKeyDown={(event) => onKeyDown(event, coordinate)}
      onClick={() => onClick(coordinate)}
    >
      <div className={classes.stone} />
    </div>
  );
}
