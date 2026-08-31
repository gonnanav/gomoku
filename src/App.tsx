import { Game } from './Game.tsx';
import classes from './App.module.css';

export function App() {
  return (
    <div className={classes.root}>
      <Game className={classes.game} />
    </div>
  );
}
