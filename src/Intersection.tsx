import clsx from 'clsx';
import { type Coordinate, type IntersectionState, boardSize } from './board.ts';
import classes from './Intersection.module.css';

type IntersectionProps = {
  coordinate: Coordinate;
  state: IntersectionState;
  onClick: (coordinate: Coordinate) => void;
};

const lastIndex = boardSize - 1;
const centerIndex = Math.floor((boardSize - 1) / 2);

export function Intersection({ coordinate, state, onClick }: IntersectionProps) {
  const { row, col } = coordinate;
  const tabIndex = row === centerIndex && col === centerIndex ? 0 : -1;

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
