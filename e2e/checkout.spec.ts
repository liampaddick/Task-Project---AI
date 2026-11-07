// spec: specs/saucedemo-test-plan.md
// seed: e2e/seed.spec.ts

import { test, expect } from './fixtures/test';
import { customer } from '../test-data/customer';
import { products, TAX_RATE } from '../test-data/products';

test.describe('Checkout', () => {
  test('Complete checkout happy path', { tag: '@regression' }, async ({
    loggedInInventoryPage,
    cartPage,
    checkoutInformationPage,
    checkoutOverviewPage,
    checkoutCompletePage,
    page,
  }) => {
    const itemTotal = products.backpack.price + products.bikeLight.price;
    const tax = itemTotal * TAX_RATE;
    const total = itemTotal + tax;

    // 1. Add backpack and bike light, checkout, fill info, continue, verify overview, finish
    await loggedInInventoryPage.addToCart(products.backpack);
    await loggedInInventoryPage.addToCart(products.bikeLight);
    await loggedInInventoryPage.header.openCart();
    await cartPage.checkout();
    await checkoutInformationPage.fillDetails(customer);
    await checkoutInformationPage.continue();

    await expect(checkoutOverviewPage.itemNames).toHaveText([products.backpack.name, products.bikeLight.name]);
    await expect(checkoutOverviewPage.subtotalLabel).toContainText(`$${itemTotal.toFixed(2)}`);
    await expect(checkoutOverviewPage.taxLabel).toContainText(`$${tax.toFixed(2)}`);
    await expect(checkoutOverviewPage.totalLabel).toContainText(`$${total.toFixed(2)}`);

    await checkoutOverviewPage.finish();

    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
    await expect(checkoutCompletePage.header.cartBadge).toBeHidden();
  });

  test('Checkout info validation errors', { tag: '@regression' }, async ({
    loggedInInventoryPage,
    cartPage,
    checkoutInformationPage,
  }) => {
    // 1. With one item in cart go to checkout, click Continue with empty form
    await loggedInInventoryPage.addToCart(products.backpack);
    await loggedInInventoryPage.header.openCart();
    await cartPage.checkout();
    await checkoutInformationPage.continue();
    await expect(checkoutInformationPage.errorMessage).toHaveText('Error: First Name is required');

    // then fill first name only
    await checkoutInformationPage.fillDetails({ firstName: customer.firstName });
    await checkoutInformationPage.continue();
    await expect(checkoutInformationPage.errorMessage).toHaveText('Error: Last Name is required');

    // then add last name only
    await checkoutInformationPage.fillDetails({ lastName: customer.lastName });
    await checkoutInformationPage.continue();
    await expect(checkoutInformationPage.errorMessage).toHaveText('Error: Postal Code is required');
  });

  test('Cancel checkout returns to cart', { tag: '@regression' }, async ({
    loggedInInventoryPage,
    cartPage,
    checkoutInformationPage,
    page,
  }) => {
    // 1. Start checkout and click Cancel
    await loggedInInventoryPage.addToCart(products.backpack);
    await loggedInInventoryPage.header.openCart();
    await cartPage.checkout();
    await checkoutInformationPage.cancel();

    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(cartPage.itemNames).toHaveText([products.backpack.name]);
  });

  test('Back Home after order', { tag: '@regression' }, async ({ completedOrderPage, inventoryPage, page }) => {
    // 1. Complete an order, click Back Home
    await completedOrderPage.backHome();

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.items.first()).toBeVisible();
    await expect(inventoryPage.header.cartBadge).toBeHidden();
  });
});
