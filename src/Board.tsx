import clsx from 'clsx'

import classes from './Board.module.css'

const size = 14 // classic Gomoku: 15x15 intersections (14x14 cells)
const cells = size * size

interface BoardProps {
  className?: string
}

function Board({ className }: BoardProps) {
  return (
    <div className={clsx(classes.root, className)}>
      {Array.from({ length: cells }, (_, i) => (
        <div key={i} className={classes.cell} />
      ))}
    </div>
  )
}

export default Board
