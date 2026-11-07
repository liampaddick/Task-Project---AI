import { type Locator, type Page } from '@playwright/test';
import { type Product } from '../test-data/products';
import { HeaderComponent } from './header-component';

export class CartPage {
  readonly header: HeaderComponent;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;

  constructor(readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.checkoutButton = page.getByTestId('checkout');
  }

  async removeItem(product: Product) {
    await this.page.getByTestId(`remove-${product.slug}`).click();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
