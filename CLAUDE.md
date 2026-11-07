# CLAUDE.md

## Project Overview

Using **TypeScript** and **Playwright**, build tests for the site <https://www.saucedemo.com/>.

## Test Scenarios

The following scenarios must be covered:

- Automate the log in flow
- A minimum of 3 other flows. Recommendations:
  - Adding to cart
  - Full checkout flow
  - Creating an order receipt PDF (the "Generate PDF order" button on `/checkout-complete.html`)

Others can be created in addition to these, but 4 flows must be covered as a minimum.

## Standards

The project must adhere to Playwright best practices, found at: <https://playwright.dev/docs/best-practices>.

## Folder Structure

| Folder       | Purpose                                  |
| ------------ | ---------------------------------------- |
| `.claude/agents` | Playwright Agents (and any approved custom agents) |
| `e2e`        | Test files, including `seed.spec.ts`     |
| `specs`      | Test plans written by the Planner        |
| `pages`      | Page files (page objects)                |
| `skills`     | Specific skill files for agents          |
| `test-data`  | Test data                                |

## Design Principles
- The project is to be built with a focus on **maintainability** and **reusability**, utilise the page object model.
- Apply this mentality of maintainability and reusablility to both data and code.
- Do not overcomplicate for the sake of it.

## Naming Conventions
- **Page Classes:** - Pascal Case
- **Methods** - camelCase and should describe the action
- **Locators** - Descriptive of the locator, can be based on the test-id if available.


## Page Object Rules
**Encapsulation**
  - All locators and actions for a page are defined in a single class.
  - no direct locator usage in test specs - always use those in pages

  **Locators**
  - Defined within class
  - Use test ids (`getByTestId`, configured as `data-test` for this site) or role as preferred attributes. Don't use CSS paths.

  **Actions**
  - Each method performs a singular task, multiple tasks, multiple methods and chain.

  **Assertions** 
  - are in test specs unless using as a form of guard assertion within a method



File naming should follow best practices, using kebab case for file names. 

## Test Structure and Tagging

- Test cases should be structured logically.
- Tests must be independent. Use Playwright fixtures for shared setup (e.g. page objects, logged-in state) rather than repeating steps or chaining tests.
- Include tags so tests can be controlled via CI/CD pipelines later.
- Unless an obvious pattern emerges, use `@regression` for now.

## README.md

A `README.md` is to be created and **kept up to date**. It must include:

- Setup instructions
- How to run the tests
- A To Do section covering what else would be automated or improved if time allowed
- Explanations of the LLM thought process when making decisions, as well as descriptions of any AI skills / agents created or used

## Agents

Start by using the agents Playwright provides:

- **Planner**
- **Generator**
- **Healer**

Workflow (as defined by Playwright): the Planner explores the site from `e2e/seed.spec.ts` and saves plans to `specs/`; the Generator turns a plan into tests in `e2e/`; the Healer runs and fixes failing tests.

Only use or create more agents if agreed with a human reviewer.
