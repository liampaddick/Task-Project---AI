// spec: specs/saucedemo-test-plan.md
// seed: e2e/seed.spec.ts

import { stat } from 'node:fs/promises';
import { test, expect } from './fixtures/test';

test.describe('Order PDF', () => {
  test('Generate PDF order downloads receipt', { tag: '@regression' }, async ({ completedOrderPage }) => {
    const { page } = completedOrderPage;

    // 1. Complete an order, start waitForEvent('download') then click Generate PDF order
    const download = await completedOrderPage.generatePdfOrder();

    expect(download.suggestedFilename()).toMatch(
      /^swag-labs-order-\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.pdf$/,
    );

    const downloadPath = await download.path();
    expect((await stat(downloadPath)).size).toBeGreaterThan(0);

    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    expect(page.context().pages()).toHaveLength(1);
  });
});
