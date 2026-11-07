export const customer = {
  firstName: 'Test',
  lastName: 'User',
  postalCode: 'AB1 2CD',
} as const;

export type Customer = { firstName: string; lastName: string; postalCode: string };
