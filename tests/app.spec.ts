import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('clicking places alternating stones, starting with black', async ({ page }) => {
  const first = getIntersection(page, 0, 0);
  await first.click();
  await expect(first).toHaveAttribute('data-state', 'black');

  const second = getIntersection(page, 1, 0);
  await second.click();
  await expect(second).toHaveAttribute('data-state', 'white');

  const third = getIntersection(page, 2, 0);
  await third.click();
  await expect(third).toHaveAttribute('data-state', 'black');
});

test('marks the last move made', async ({ page }) => {
  const first = getIntersection(page, 0, 0);
  const second = getIntersection(page, 1, 0);

  await expect(first).not.toHaveAttribute('data-last-move');
  await first.click();
  await expect(first).toHaveAttribute('data-last-move');

  await second.click();
  await expect(first).not.toHaveAttribute('data-last-move');
  await expect(second).toHaveAttribute('data-last-move');
});

test('marks the stones of the line that won the game', async ({ page }) => {
  await play(
    page,
    [0, 0], [0, 7],
    [1, 0], [1, 7],
    [2, 0], [2, 7],
    [3, 0], [3, 7],
  );

  for (let x = 0; x <= 3; x++) {
    await expect(getIntersection(page, x, 0)).not.toHaveAttribute('data-winning');
  }

  await play(page, [4, 0]);

  for (let x = 0; x <= 4; x++) {
    await expect(getIntersection(page, x, 0)).toHaveAttribute('data-winning');
  }
  await expect(getIntersection(page, 0, 7)).not.toHaveAttribute('data-winning');
});

test('clicking an occupied intersection is ignored', async ({ page }) => {
  const first = getIntersection(page, 0, 0);
  await first.click();

  await expect(first).toHaveAttribute('data-state', 'black');
  await first.click();
  await expect(first).toHaveAttribute('data-state', 'black');

  // The ignored click didn't consume the turn: white is still the one to play
  const second = getIntersection(page, 1, 0);
  await second.click();
  await expect(second).toHaveAttribute('data-state', 'white');
});

test('tab focuses the center intersection by default', async ({ page }) => {
  await page.keyboard.press('Tab');

  await expect(getIntersection(page, 0, 0)).toBeFocused();
});

test('tab returns to the last focused intersection', async ({ page }) => {
  const intersection = getIntersection(page, 2, 2);
  await intersection.focus();

  await page.keyboard.press('Shift+Tab');
  await expect(intersection).not.toBeFocused();

  await page.keyboard.press('Tab');
  await expect(intersection).toBeFocused();
});

for (const key of ['Enter', 'Space']) {
  test(`pressing ${key} on the focused intersection places a stone on it`, async ({ page }) => {
    const intersection = getIntersection(page, 0, 0);
    await intersection.focus();
    await page.keyboard.press(key);

    await expect(intersection).toHaveAttribute('data-state', 'black');
  });
}

test('arrow keys navigate focus to adjacent intersections', async ({ page }) => {
  await getIntersection(page, 0, 0).focus();

  await page.keyboard.press('ArrowUp');
  await expect(getIntersection(page, 0, 1)).toBeFocused();

  await page.keyboard.press('ArrowDown');
  await expect(getIntersection(page, 0, 0)).toBeFocused();

  await page.keyboard.press('ArrowRight');
  await expect(getIntersection(page, 1, 0)).toBeFocused();

  await page.keyboard.press('ArrowLeft');
  await expect(getIntersection(page, 0, 0)).toBeFocused();
});

test('arrow keys keep focus in place at the edges of the board', async ({ page }) => {
  // The two opposite corners between them exercise all four edges.
  const topLeft = getIntersection(page, -7, 7);
  await topLeft.focus();

  await page.keyboard.press('ArrowUp');
  await expect(topLeft).toBeFocused();

  await page.keyboard.press('ArrowLeft');
  await expect(topLeft).toBeFocused();

  const bottomRight = getIntersection(page, 7, -7);
  await bottomRight.focus();

  await page.keyboard.press('ArrowDown');
  await expect(bottomRight).toBeFocused();

  await page.keyboard.press('ArrowRight');
  await expect(bottomRight).toBeFocused();
});

test.describe('on a device without hover (mobile)', () => {
  test.use({ hasTouch: true });

  test('the first tap previews a stone and the second tap places it', async ({ page }) => {
    const intersection = getIntersection(page, 0, 0);

    await expect(intersection).not.toHaveAttribute('data-previewed');
    await intersection.tap();
    await expect(intersection).toHaveAttribute('data-previewed');
    await expect(intersection).toHaveAttribute('data-state', 'empty');

    await intersection.tap();
    await expect(intersection).not.toHaveAttribute('data-previewed');
    await expect(intersection).toHaveAttribute('data-state', 'black');
  });

  test('tapping another intersection moves the preview to it', async ({ page }) => {
    const first = getIntersection(page, 0, 0);
    const second = getIntersection(page, 1, 0);

    await first.tap();
    await expect(first).toHaveAttribute('data-previewed');

    await second.tap();
    await expect(first).not.toHaveAttribute('data-previewed');
    await expect(second).toHaveAttribute('data-previewed');
  });
});

function getIntersection(page: Page, x: number, y: number) {
  return page.getByTestId(`intersection-(${x},${y})`);
}

async function play(page: Page, ...moves: [x: number, y: number][]) {
  for (const [x, y] of moves) await getIntersection(page, x, y).click();
}
