// spec: specs/saucedemo-test-plan.md
// seed: e2e/seed.spec.ts

import { test, expect } from './fixtures/test';
import { INVENTORY_ITEM_COUNT } from '../test-data/products';
import { users } from '../test-data/users';

test.describe('Login', () => {
  test('Valid login', { tag: '@regression' }, async ({ loginPage, inventoryPage, page }) => {
    // 1. Go to / and log in as standard_user / secret_sauce
    await loginPage.goto();
    await loginPage.login(users.standard);

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.items).toHaveCount(INVENTORY_ITEM_COUNT);
  });

  test('Locked out user is rejected', { tag: '@regression' }, async ({ loginPage, page }) => {
    // 1. Log in as locked_out_user / secret_sauce
    await loginPage.goto();
    await loginPage.login(users.lockedOut);

    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out.');
    await expect(page).toHaveURL(/\/$/);
  });

  test('Invalid credentials', { tag: '@regression' }, async ({ loginPage }) => {
    // 1. Log in as standard_user / wrong
    await loginPage.goto();
    await loginPage.login({ username: users.standard.username, password: users.invalid.password });

    await expect(loginPage.errorMessage).toContainText(
      'Username and password do not match any user in this service',
    );
  });

  test('Empty username', { tag: '@regression' }, async ({ loginPage }) => {
    // 1. Click Login with both fields empty
    await loginPage.goto();
    await loginPage.loginButton.click();

    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('Empty password', { tag: '@regression' }, async ({ loginPage }) => {
    // 1. Enter standard_user only and click Login
    await loginPage.goto();
    await loginPage.login({ username: users.standard.username });

    await expect(loginPage.errorMessage).toContainText('Password is required');
  });

  test('Logout', { tag: '@regression' }, async ({ loggedInInventoryPage, loginPage, page }) => {
    // 1. Log in, open menu, click Logout
    await loggedInInventoryPage.header.logout();

    await expect(page).toHaveURL(/\/$/);
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.usernameInput).toBeVisible();
  });

  test(
    'Unauthenticated direct access to inventory',
    { tag: '@regression' },
    async ({ inventoryPage, loginPage, page }) => {
      // 1. Navigate directly to /inventory.html with no session
      await inventoryPage.goto();

      await expect(page).toHaveURL(/\/$/);
      await expect(loginPage.errorMessage).toContainText(
        "You can only access '/inventory.html' when you are logged in.",
      );
    },
  );
});
