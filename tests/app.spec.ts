import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('clicking an intersection places a black stone on it', async ({ page }) => {
  const intersection = getIntersection(page, 7, 7);
  await intersection.click();

  await expect(intersection).toHaveText('black');
});

test('tab focuses the center intersection by default', async ({ page }) => {
  await page.keyboard.press('Tab');

  await expect(getIntersection(page, 7, 7)).toBeFocused();
});

test('tab returns to the last focused intersection', async ({ page }) => {
  const intersection = getIntersection(page, 3, 3);
  await intersection.focus();

  await page.keyboard.press('Shift+Tab');
  await expect(intersection).not.toBeFocused();

  await page.keyboard.press('Tab');
  await expect(intersection).toBeFocused();
});

for (const key of ['Enter', 'Space']) {
  test(`pressing ${key} on the focused intersection places a stone on it`, async ({ page }) => {
    const intersection = getIntersection(page, 7, 7);
    await intersection.focus();
    await page.keyboard.press(key);

    await expect(intersection).toHaveText('black');
  });
}

test('arrow keys navigate focus to adjacent intersections', async ({ page }) => {
  await getIntersection(page, 7, 7).focus();

  await page.keyboard.press('ArrowUp');
  await expect(getIntersection(page, 6, 7)).toBeFocused();

  await page.keyboard.press('ArrowDown');
  await expect(getIntersection(page, 7, 7)).toBeFocused();

  await page.keyboard.press('ArrowLeft');
  await expect(getIntersection(page, 7, 6)).toBeFocused();

  await page.keyboard.press('ArrowRight');
  await expect(getIntersection(page, 7, 7)).toBeFocused();
});

test.describe('on a device without hover (e.g. mobile)', () => {
  test.use({ hasTouch: true });

  test('the first tap previews a stone and the second tap places it', async ({ page }) => {
    const intersection = getIntersection(page, 7, 7);

    await intersection.tap();
    await expect(intersection).toHaveText('preview');

    await intersection.tap();
    await expect(intersection).toHaveText('black');
  });
});

function getIntersection(page: Page, row: number, col: number) {
  return page.getByTestId(`intersection-${row},${col}`);
}
