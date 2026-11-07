import { type Locator, type Page } from '@playwright/test';
import { type User } from '../test-data/users';

export class LoginPage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(readonly page: Page) {
    this.usernameInput = page.getByTestId('username');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.errorMessage = page.getByTestId('error');
  }

  async goto() {
    await this.page.goto('/');
  }

  /** Accepts partial credentials so validation scenarios can leave a field empty. */
  async login(user: Partial<User>) {
    if (user.username !== undefined) await this.usernameInput.fill(user.username);
    if (user.password !== undefined) await this.passwordInput.fill(user.password);
    await this.loginButton.click();
  }
}
