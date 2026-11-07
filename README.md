# Task Project - AI

Playwright + TypeScript tests for <https://www.saucedemo.com/>, built using an agentic workflow (Playwright Planner, Generator and Healer agents).

## Setup

1. Install Node.js (LTS).
2. `npm install`
3. `npx playwright install chromium`
4. The `.env` file is included in the repo, so no extra configuration is needed. It contains:
   ```
   BASE_URL=https://www.saucedemo.com
   ```

> **Note on `.env`:** it is committed intentionally. This is a technical task against a public demo site, and the file only holds the Saucedemo base URL. The test credentials are the public ones published on the Saucedemo login page (in `test-data/users.ts`). Nothing sensitive is stored. In a real project `.env` would be git-ignored and a `.env.example` committed instead.

## Running the tests

- All tests: `npx playwright test`
- By tag: `npx playwright test --grep @regression`
- One file: `npx playwright test e2e/checkout.spec.ts`
- Typecheck: `npx tsc -p .`
- Open the last report: `npx playwright show-report`

Only Chromium is configured for now.

## Coverage (18 tests, all tagged `@regression`)

| Spec                     | Scenarios                                                                          |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `e2e/login.spec.ts`      | valid, locked-out, invalid credentials, empty username/password, logout, unauthenticated access |
| `e2e/cart.spec.ts`       | add (badge), remove on inventory page, cart page list + removal                    |
| `e2e/checkout.spec.ts`   | happy path with totals, form validation errors, cancel, back home                  |
| `e2e/order-pdf.spec.ts`  | "Generate PDF order" download (filename pattern, non-empty, no new tab)            |
| `e2e/inventory.spec.ts`  | sort by price low-high, name Z-A                                                   |

## Project structure

| Folder           | Purpose                                                                  |
| ---------------- | ------------------------------------------------------------------------ |
| `.claude/agents` | Playwright Planner, Generator and Healer                                 |
| `e2e`            | Specs, `seed.spec.ts`, and `fixtures/test.ts` (page objects + shared setup) |
| `specs`          | Test plan produced by the Planner (`saucedemo-test-plan.md`)             |
| `pages`          | Page objects (one class per page, plus a shared header component)        |
| `skills`         | Skill files for agents (none yet)                                        |
| `test-data`      | Users, products, customer details                                        |

## AI agents and decisions

**Workflow followed:** Planner explored the site from `e2e/seed.spec.ts` and saved `specs/saucedemo-test-plan.md`; Generator turned each suite into a spec; tests were run; the Healer was not needed because nothing failed. The agents live in `.claude/agents` and use the `playwright-test` MCP server (`.mcp.json`). No custom agents or skills were created.

**Decisions and reasoning - AI Generated these as asked in Claude.md:**

- **Page objects written by hand, specs by the Generator.** The Generator agent can only write spec files (no edit/shell tools), so shared page objects, fixtures and test data were written from the Planner's observed `data-test` ids. The Generator was told to use only page-object members and to report gaps instead of inlining locators.
- **Specs grouped per suite** (5 files) rather than the plan's one-file-per-scenario (19 files), to avoid over-engineering.
- **Fixtures for shared setup.** `loggedInInventoryPage` (standard-user session) and `completedOrderPage` (an order already placed) keep tests independent without repeating steps or chaining.
- **`testIdAttribute` is `data-test`** because Saucedemo does not use `data-testid`.
- **Expected totals are computed** from product prices and `TAX_RATE` rather than hardcoded strings.
- **PDF button:** it triggers a real browser download (no new tab or dialog) with a timestamped filename, so the test registers `waitForEvent('download')` before clicking and matches the name with a regex. PDF contents are not inspected.
- **Console errors are ignored:** every page logs a harmless "Permissions policy violation: unload" message.
- **Credentials** are the public demo ones shown on the login page, kept in `test-data/users.ts`.
- **Early planner stall:** the first Planner run hung without saving; it was stopped and re-run with a tighter brief (limited exploration, save early).

## Notes from Liam
**Considerations and usage of AI**

As this is a short time window, the following considerations and actions were made: 
- I created the Claude.md file and folder structure as welll as adding Playwright agents.
- Given the limited time period, it made sense to add known agents from Playwright to achieve speed and compatibility, the Claude.md file gives them extra guidleines and guardrails.
- Once an initial draft setup was created, this was given to Claude to review and spot any missing or lacking areas and these were rectified if I agreed.
- Kicked Claude code off, telling it to use the Claude.md file and agents to produce an initial coverage of the sauce demo website. This hung on the first run for 20 minutes. Interrupting Claude and retrying produced a successful flow, resulting in tests being created for multiple scenarios.
- Scenarios recommended to Claude were in the Claude.md file but it was given free reign to create more, it did.
- Even after the second attempt, Claude was unable to create a test suite that worked completely, the download PDF test fails due to the remote connection it perceives and therefore download.path does not pick up the file.
- The AI appears to have taken the Claude.md too literally in parts, specifically around not overcomplicating for the sake of it. For example, it could have used a different approach to multiple items being added to the cart (As seen in handwritten task) to allow for that type of test to be more flexible, rather than calling the same method multiple times with a new item each time. This is an example of where specifics and examples as well as review processes can improve the output.

**Future Changes**
- The Claude.md file could be updated to test for timeouts, hangs or loops so that agents don't get stuck and achieve nothing.
- Adding an Agents.md file with specific rules for the level of complexity and deeper examples to help guide it. For example, the add to cart test functionality above.
 - A lower level .md file structure to take more text and context out of the Claude.md. Using it as a list of references that only load in as and when needed.
 - Implementing a custom agent/tool that would be an augmented type of planner agent or a pre-decessor to it. Likely called a mapping agent. Currently the planner reviews and pulls out locators as needed for the tests. A Mapping agent could review the entire webpage/UI, creating a catalogue of all Locators. It could then flag locators that may be brittle and the artefact produced could be reviewed by a human or another agent.
 - Review agents, review processes, The current Claude.md doesn't include anything around reviewing between stages, even using an agent. So it goes through planner to generator to healer one after the other. This may lead to it generating cases that aren't needed/wanted or "fixing" tests in a way that passes them without testing the desired functionality as intended. Human or agent review stages could be considered at least initially to build confidence.
 - The agents only run each stage once. This seems most critical for the planner agent as multiple tries might produce different scope due to the nnature of LLMs. There should be functionality included in agent behaviour or Claude.md to allow for multiple retries, a combined view of these generated scopes as well as outliers that only one run picked up on to improve coverage.


## Notes for other machines

`.mcp.json` launches the MCP server with `cmd /c npx`, which is Windows-only. On macOS/Linux change the command to `npx` with args `["playwright", "run-test-mcp-server"]`.

## To Do

- Cover `problem_user`, `performance_glitch_user` and `error_user` (known to misbehave; likely need expected-failure handling)
- Inspect PDF contents (items and totals) with a PDF parser
- Remaining sort options (A-Z, high-low), product detail page, social links and footer, `reset app state`
- Add Firefox/WebKit and mobile projects
- npm scripts, linting/formatting, and a CI tag split (e.g. `@smoke` vs `@regression`)
- Move the login step to a cached `storageState` if the suite grows
- Visual and accessibility checks

## Link to Handwritten Variant
- https://github.com/liampaddick/Task-Project

