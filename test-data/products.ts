export type Product = { name: string; slug: string; price: number };

/** Slug matches the suffix used by the add-to-cart-/remove- data-test ids. */
export const products = {
  backpack: { name: 'Sauce Labs Backpack', slug: 'sauce-labs-backpack', price: 29.99 },
  bikeLight: { name: 'Sauce Labs Bike Light', slug: 'sauce-labs-bike-light', price: 9.99 },
} as const satisfies Record<string, Product>;

export const TAX_RATE = 0.08;
export const INVENTORY_ITEM_COUNT = 6;
