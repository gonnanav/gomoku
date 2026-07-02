# Gomoku

## Scripts

Prefer the project's npm scripts over invoking the underlying tools directly (e.g. run `npm run typecheck`, not `npx tsc`). The scripts encode the project's intended flags, so they stay correct as configuration changes. Check the `scripts` field in `package.json` for what's available.

## Styling

- Use **CSS Modules** for component styles. Name files `*.module.css` (co-located with the component).
- Import the module as **`classes`** (not `styles`):

  ```tsx
  import classes from './Board.module.css'

  <div className={classes.board} />
  ```

- Keep global styles (resets, viewport layout) in plain `index.css`, not in a module.

### Property Groups

Properties within a rule are grouped by category with a comment header. The four categories, in order:

1. **Layout** — how the element participates in and establishes layout: `display`, flex/grid properties, `align-*`, `justify-*`, `gap`, `container-type`, etc.
2. **Box model** — the element's own box: `width`, `height`, `min-*`, `max-*`, `padding`, `margin`, `border`, `border-radius`, `overflow`, etc.
3. **Visual** — appearance: `background`, `color`, `font-*`, `opacity`, `text-*`, etc.
4. **Interaction** — behavior in response to user input or time: `cursor`, `transition`, `animation`, etc.

Omit a group entirely if the rule has no properties for it.

