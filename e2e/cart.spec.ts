// spec: specs/saucedemo-test-plan.md
// seed: e2e/seed.spec.ts

import { test, expect } from './fixtures/test';
import { products } from '../test-data/products';

test.describe('Cart', () => {
  test('Add items updates badge', { tag: '@regression' }, async ({ loggedInInventoryPage: inventoryPage }) => {
    // 1. Logged in, add Sauce Labs Backpack and Bike Light
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.addToCart(products.bikeLight);

    await expect(inventoryPage.header.cartBadge).toHaveText('2');
    await expect(inventoryPage.removeButton(products.backpack)).toBeVisible();
    await expect(inventoryPage.removeButton(products.bikeLight)).toBeVisible();
  });

  test('Remove item from inventory page', { tag: '@regression' }, async ({ loggedInInventoryPage: inventoryPage }) => {
    // 1. Add backpack then click Remove
    await inventoryPage.addToCart(products.backpack);
    await expect(inventoryPage.header.cartBadge).toHaveText('1');
    await inventoryPage.removeFromCart(products.backpack);

    await expect(inventoryPage.header.cartBadge).toBeHidden();
    await expect(inventoryPage.addToCartButton(products.backpack)).toBeVisible();
    await expect(inventoryPage.removeButton(products.backpack)).toBeHidden();
  });

  test('Cart page lists items and removal works', { tag: '@regression' }, async ({
    loggedInInventoryPage: inventoryPage,
    cartPage,
  }) => {
    // 1. Add two items, open cart, remove one
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.addToCart(products.bikeLight);
    await inventoryPage.header.openCart();

    await expect(cartPage.items).toHaveCount(2);
    await expect(cartPage.itemNames).toHaveText([products.backpack.name, products.bikeLight.name]);

    await cartPage.removeItem(products.backpack);

    await expect(cartPage.items).toHaveCount(1);
    await expect(cartPage.itemNames).toHaveText([products.bikeLight.name]);
    await expect(cartPage.header.cartBadge).toHaveText('1');
  });
});
