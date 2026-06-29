import { Board } from './Board.tsx';
import classes from './App.module.css';

export function App() {
  return (
    <div className={classes.root}>
      <Board />
    </div>
  );
}
