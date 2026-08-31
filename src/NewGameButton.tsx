import clsx from 'clsx';
import classes from './NewGameButton.module.css';

type NewGameButtonProps = {
  className?: string;
  onClick: () => void;
};

export function NewGameButton({ className, onClick }: NewGameButtonProps) {
  return (
    <button className={clsx(classes.root, className)} type="button" onClick={onClick}>
      <svg
        className={classes.icon}
        viewBox="0 0 20 20"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M16.5 6.5V2.75m0 3.75h-3.75m3.55-.2a7 7 0 1 0 .55 6.65" />
      </svg>
      New game
    </button>
  );
}
