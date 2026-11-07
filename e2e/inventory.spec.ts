// spec: specs/saucedemo-test-plan.md
// seed: e2e/seed.spec.ts

import { test, expect } from './fixtures/test';

test.describe('Inventory sorting', () => {
  test('Sort by price low to high', { tag: '@regression' }, async ({ loggedInInventoryPage }) => {
    // 1. Select 'Price (low to high)' (value lohi)
    await loggedInInventoryPage.sortBy('lohi');

    const expectedPrices = [7.99, 9.99, 15.99, 15.99, 29.99, 49.99];
    await expect.poll(() => loggedInInventoryPage.getItemPrices()).toEqual(expectedPrices);

    const prices = await loggedInInventoryPage.getItemPrices();
    expect(prices).toHaveLength(6);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('Sort by name Z to A', { tag: '@regression' }, async ({ loggedInInventoryPage }) => {
    // Default order is A to Z; derive the expected reverse order from the page's own data.
    const defaultNames = await loggedInInventoryPage.getItemNames();
    expect(defaultNames).toHaveLength(6);
    const expectedNames = [...defaultNames].sort().reverse();

    // 1. Select 'Name (Z to A)' (value za)
    await loggedInInventoryPage.sortBy('za');

    await expect.poll(() => loggedInInventoryPage.getItemNames()).toEqual(expectedNames);
  });
});
