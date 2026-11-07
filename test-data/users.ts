/**
 * Public demo credentials published on the Saucedemo login page.
 * Not secrets - safe to commit.
 */
export const PASSWORD = 'secret_sauce';

export const users = {
  standard: { username: 'standard_user', password: PASSWORD },
  lockedOut: { username: 'locked_out_user', password: PASSWORD },
  invalid: { username: 'invalid_user', password: 'wrong_password' },
} as const;

export type User = { username: string; password: string };
