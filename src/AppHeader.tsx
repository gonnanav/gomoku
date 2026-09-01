import classes from './AppHeader.module.css';

export function AppHeader() {
  return (
    <div className={classes.root}>
      <img
        className={classes.logo}
        src="/logo.png"
        alt='' // Avoid repeating the adjacent Gonnoku heading to screen readers.
        width="48"
        height="48"
      />
      <div>
        <h1 className={classes.title}>Gonnoku</h1>
        <p className={classes.tagline}>Gomoku by Gonn</p>
      </div>
    </div>
  );
}
