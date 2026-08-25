import { type KeyboardEvent } from 'react';
import clsx from 'clsx';
import { type Coordinate, type IntersectionStatus, type StoneColor, edgesAt } from './game.ts';
import classes from './Intersection.module.css';

type IntersectionProps = {
  coordinate: Coordinate;
  status: IntersectionStatus;
  previewColor: StoneColor | null;
  tabIndex: number;
  registerElement: (element: HTMLElement | null, coordinate: Coordinate) => void;
  onFocus: (coordinate: Coordinate) => void;
  onKeyDown: (event: KeyboardEvent, coordinate: Coordinate) => void;
  onClick: (coordinate: Coordinate) => void;
};

export function Intersection({
  coordinate,
  status,
  previewColor,
  tabIndex,
  registerElement,
  onFocus,
  onKeyDown,
  onClick,
}: IntersectionProps) {
  const edges = edgesAt(coordinate);
  const isLastMove = status.kind !== 'empty' && status.isLastMove;
  const isPreviewed = status.kind === 'empty' && status.isPreviewed;
  const isWinning = status.kind !== 'empty' && status.isWinning;

  return (
    <div
      ref={(element) => registerElement(element, coordinate)}
      className={clsx(classes.root, {
        [classes.edgeTop]: edges.top,
        [classes.edgeRight]: edges.right,
        [classes.edgeBottom]: edges.bottom,
        [classes.edgeLeft]: edges.left,
      })}
      data-testid={`intersection-(${coordinate.x},${coordinate.y})`}
      data-status={status.kind}
      data-last-move={isLastMove ? '' : undefined}
      data-previewed={isPreviewed ? '' : undefined}
      data-winning={isWinning ? '' : undefined}
      data-preview-color={status.kind === 'empty' ? previewColor : undefined}
      tabIndex={tabIndex}
      onFocus={() => onFocus(coordinate)}
      onKeyDown={(event) => onKeyDown(event, coordinate)}
      onClick={() => onClick(coordinate)}
    >
      <div className={classes.stone} />
    </div>
  );
}
