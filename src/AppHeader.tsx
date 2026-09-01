import classes from './AppHeader.module.css';

export function AppHeader() {
  return (
    <div className={classes.root}>
      <img
        className={classes.logo}
        src="/logo.png"
        alt='' // Avoid repeating the adjacent Gomoku heading to screen readers.
        width="48"
        height="48"
      />
      <div>
        <h1 className={classes.title}>Gomoku</h1>
        <p className={classes.tagline}>Five in a row</p>
      </div>
    </div>
  );
}
