import { test } from './fixtures/test';

// Seed for the Planner/Generator: leaves the browser on a fresh login page.
test.describe('Seed', () => {
  test('seed', { tag: '@regression' }, async ({ loginPage }) => {
    await loginPage.goto();
  });
});
