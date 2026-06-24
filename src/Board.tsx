import clsx from 'clsx';
import classes from './Board.module.css';

const size = 15; // classic Gomoku: 15x15 intersections
const intersections = size * size;
const last = size - 1;

interface BoardProps {
  className?: string;
}

function Board({ className }: BoardProps) {
  return (
    <div className={clsx(classes.root, className)}>
      {Array.from({ length: intersections }, (_, i) => {
        const row = Math.floor(i / size);
        const col = i % size;

        return (
          <div
            key={i}
            className={clsx(classes.intersection, {
              [classes.edgeTop]: row === 0,
              [classes.edgeRight]: col === last,
              [classes.edgeBottom]: row === last,
              [classes.edgeLeft]: col === 0,
            })}
          />
        );
      })}
    </div>
  );
}

export default Board;
