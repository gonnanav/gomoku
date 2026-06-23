import Board from './Board.tsx'
import classes from './App.module.css';

function App() {
  return (
    <div className={classes.root}>
      <Board className={classes.board} />
    </div>
  )
}

export default App
