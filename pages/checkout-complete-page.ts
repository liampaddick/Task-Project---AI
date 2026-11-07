import { type Download, type Locator, type Page } from '@playwright/test';
import { HeaderComponent } from './header-component';

export class CheckoutCompletePage {
  readonly header: HeaderComponent;
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;
  readonly generatePdfButton: Locator;

  constructor(readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.completeHeader = page.getByTestId('complete-header');
    this.completeText = page.getByTestId('complete-text');
    this.backHomeButton = page.getByTestId('back-to-products');
    this.generatePdfButton = page.getByTestId('generate-pdf-order');
  }

  async backHome() {
    await this.backHomeButton.click();
  }

  /** The button triggers a browser download (no new tab), so register the listener before clicking. */
  async generatePdfOrder(): Promise<Download> {
    const downloadPromise = this.page.waitForEvent('download');
    await this.generatePdfButton.click();
    return downloadPromise;
  }
}
