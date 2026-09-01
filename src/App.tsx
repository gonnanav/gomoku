import { Game } from './Game.tsx';
import { AppHeader } from './AppHeader.tsx';
import classes from './App.module.css';

export function App() {
  return (
    <div className={classes.root}>
      <header className={classes.header}>
        <AppHeader />
      </header>
      <main className={classes.content}>
        <Game className={classes.game} />
      </main>
    </div>
  );
}
