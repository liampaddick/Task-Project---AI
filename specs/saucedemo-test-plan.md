# Saucedemo Test Plan

## Application Overview

Test plan for https://www.saucedemo.com (Swag Labs). Covers login, cart, full checkout, PDF order download and inventory sorting. All scenarios assume a fresh browser context. Credentials: standard_user / locked_out_user, password secret_sauce (test-data/users.ts). Locators use getByTestId (data-test). Key ids: username, password, login-button, error; inventory: product-sort-container, inventory-item-price, add-to-cart-<slug> (e.g. add-to-cart-sauce-labs-backpack), remove-<slug>, shopping-cart-link, shopping-cart-badge, open-menu, logout-sidebar-link; cart/checkout: checkout, continue, firstName, lastName, postalCode, subtotal-label, tax-label, total-label, finish, cancel; complete: complete-header, complete-text, back-to-products, generate-pdf-order. Observed behaviours: errors are "Epic sadface: Username is required", "Password is required", "Username and password do not match any user in this service", "Sorry, this user has been locked out."; unauthenticated /inventory.html redirects to / with "Epic sadface: You can only access '/inventory.html' when you are logged in."; checkout errors are "Error: First Name is required", "Last Name is required", "Postal Code is required"; backpack + bike light gives Item total $39.98, Tax $3.20, Total $43.18 (tax about 8%). Quirks: Generate PDF order triggers a real browser download (swag-labs-order-YYYY-MM-DD_HH-MM-SS.pdf, timestamped, so match with regex), no new tab, no dialog, page stays on /checkout-complete.html, button stays enabled. A harmless console error "Permissions policy violation: unload" appears on every page; do not fail tests on console errors.

## Test Scenarios

### 1. Login

**Seed:** `e2e/seed.spec.ts`

#### 1.1. Valid login

**File:** `e2e/login/valid-login.spec.ts`

**Steps:**
  1. Go to / and log in as standard_user / secret_sauce
    - expect: URL is /inventory.html
    - expect: Products page with 6 items shown

#### 1.2. Locked out user is rejected

**File:** `e2e/login/locked-out-login.spec.ts`

**Steps:**
  1. Log in as locked_out_user / secret_sauce
    - expect: Error contains 'Sorry, this user has been locked out.'
    - expect: URL remains /

#### 1.3. Invalid credentials

**File:** `e2e/login/invalid-login.spec.ts`

**Steps:**
  1. Log in as standard_user / wrong
    - expect: Error 'Username and password do not match any user in this service'

#### 1.4. Empty username

**File:** `e2e/login/empty-username.spec.ts`

**Steps:**
  1. Click Login with both fields empty
    - expect: Error 'Username is required'

#### 1.5. Empty password

**File:** `e2e/login/empty-password.spec.ts`

**Steps:**
  1. Enter standard_user only and click Login
    - expect: Error 'Password is required'

#### 1.6. Logout

**File:** `e2e/login/logout.spec.ts`

**Steps:**
  1. Log in, open menu, click Logout
    - expect: Returned to / with login form visible

#### 1.7. Unauthenticated direct access to inventory

**File:** `e2e/login/unauthenticated-access.spec.ts`

**Steps:**
  1. Navigate directly to /inventory.html with no session
    - expect: Redirected to /
    - expect: Error mentions you can only access '/inventory.html' when logged in

### 2. Cart

**Seed:** `e2e/seed.spec.ts`

#### 2.1. Add items updates badge

**File:** `e2e/cart/add-to-cart.spec.ts`

**Steps:**
  1. Logged in, add Sauce Labs Backpack and Bike Light
    - expect: Badge shows 2
    - expect: Buttons change to Remove

#### 2.2. Remove item from inventory page

**File:** `e2e/cart/remove-from-inventory.spec.ts`

**Steps:**
  1. Add backpack then click Remove
    - expect: Badge disappears
    - expect: Button reverts to Add to cart

#### 2.3. Cart page lists items and removal works

**File:** `e2e/cart/cart-page.spec.ts`

**Steps:**
  1. Add two items, open cart, remove one
    - expect: Cart initially lists both
    - expect: After removal one item and badge 1

### 3. Checkout

**Seed:** `e2e/seed.spec.ts`

#### 3.1. Complete checkout happy path

**File:** `e2e/checkout/checkout-happy-path.spec.ts`

**Steps:**
  1. Add backpack and bike light, checkout, fill info (any values), continue, verify overview, finish
    - expect: Item total $39.98, Tax $3.20, Total $43.18
    - expect: URL /checkout-complete.html
    - expect: 'Thank you for your order!' shown
    - expect: Cart badge gone

#### 3.2. Checkout info validation errors

**File:** `e2e/checkout/checkout-validation.spec.ts`

**Steps:**
  1. With one item in cart go to checkout, click Continue with empty form, then fill first name only, then add last name only
    - expect: 'Error: First Name is required'
    - expect: 'Error: Last Name is required'
    - expect: 'Error: Postal Code is required'

#### 3.3. Cancel checkout returns to cart

**File:** `e2e/checkout/checkout-cancel.spec.ts`

**Steps:**
  1. Start checkout and click Cancel
    - expect: Returns to cart with items retained

#### 3.4. Back Home after order

**File:** `e2e/checkout/back-home.spec.ts`

**Steps:**
  1. Complete an order, click Back Home
    - expect: Inventory page shown with empty cart

### 4. Order PDF

**Seed:** `e2e/seed.spec.ts`

#### 4.1. Generate PDF order downloads receipt

**File:** `e2e/order-pdf/generate-pdf-order.spec.ts`

**Steps:**
  1. Complete an order, start waitForEvent('download') then click Generate PDF order
    - expect: Download filename matches /^swag-labs-order-\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.pdf$/
    - expect: File is non-empty
    - expect: Page stays on /checkout-complete.html with no new tab

### 5. Inventory sorting

**Seed:** `e2e/seed.spec.ts`

#### 5.1. Sort by price low to high

**File:** `e2e/inventory/sort-price.spec.ts`

**Steps:**
  1. Select 'Price (low to high)' (value lohi)
    - expect: Prices ascending: 7.99, 9.99, 15.99, 15.99, 29.99, 49.99

#### 5.2. Sort by name Z to A

**File:** `e2e/inventory/sort-name.spec.ts`

**Steps:**
  1. Select 'Name (Z to A)' (value za)
    - expect: Item names in reverse alphabetical order
