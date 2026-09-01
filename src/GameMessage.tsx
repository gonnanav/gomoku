import clsx from 'clsx';
import type { GameStatus } from './game.ts';
import classes from './GameMessage.module.css';

type GameMessageProps = {
  className?: string;
  status: GameStatus;
};

export function GameMessage({ className, status }: GameMessageProps) {
  return <p className={clsx(classes.root, className)}>{messageFor(status)}</p>;
}

function messageFor(status: GameStatus): string {
  switch (status.kind) {
    case 'playing':
      return status.currentColor === 'black' ? `Black's turn` : `White's turn`;
    case 'won':
      return status.winner === 'black' ? 'Black wins!' : 'White wins!';
  }
}
