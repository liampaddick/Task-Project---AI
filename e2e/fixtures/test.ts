import { test as base } from '@playwright/test';
import { CartPage } from '../../pages/cart-page';
import { CheckoutCompletePage } from '../../pages/checkout-complete-page';
import { CheckoutInformationPage } from '../../pages/checkout-information-page';
import { CheckoutOverviewPage } from '../../pages/checkout-overview-page';
import { InventoryPage } from '../../pages/inventory-page';
import { LoginPage } from '../../pages/login-page';
import { customer } from '../../test-data/customer';
import { products } from '../../test-data/products';
import { users } from '../../test-data/users';

type Fixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutInformationPage: CheckoutInformationPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
  /** InventoryPage with a standard-user session already established. Use instead of inventoryPage when logged in. */
  loggedInInventoryPage: InventoryPage;
  /** CheckoutCompletePage after logging in and placing an order for the backpack and bike light. */
  completedOrderPage: CheckoutCompletePage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutInformationPage: async ({ page }, use) => use(new CheckoutInformationPage(page)),
  checkoutOverviewPage: async ({ page }, use) => use(new CheckoutOverviewPage(page)),
  checkoutCompletePage: async ({ page }, use) => use(new CheckoutCompletePage(page)),
  loggedInInventoryPage: async ({ loginPage, inventoryPage }, use) => {
    await loginPage.goto();
    await loginPage.login(users.standard);
    await inventoryPage.itemNames.first().waitFor();
    await use(inventoryPage);
  },
  completedOrderPage: async (
    { loggedInInventoryPage, cartPage, checkoutInformationPage, checkoutOverviewPage, checkoutCompletePage },
    use,
  ) => {
    await loggedInInventoryPage.addToCart(products.backpack);
    await loggedInInventoryPage.addToCart(products.bikeLight);
    await loggedInInventoryPage.header.openCart();
    await cartPage.checkout();
    await checkoutInformationPage.fillDetails(customer);
    await checkoutInformationPage.continue();
    await checkoutOverviewPage.finish();
    await checkoutCompletePage.completeHeader.waitFor();
    await use(checkoutCompletePage);
  },
});

export { expect } from '@playwright/test';
