# Agent Instructions

## Project Context

This repository contains Android end-to-end tests for the Video QA Challenge technical assignment. The application is a deterministic video demo with consent, a content overview, video details, and a video player state machine.

Read these sources before designing or changing tests:

- `TEST_PLAN.md` for risk priorities, required scenarios, expected behavior, and open questions.
- `Test Assignment.pdf` for the assignment scope, quality expectations, and locator guidance.
- `test/specs/base.spec.e2e.ts` for the required spec structure.
- `test/screenobjects/AppScreen.ts` for the base screen object pattern.

The project uses TypeScript, WebdriverIO 9, Appium, and Mocha. Android is the only supported platform at this stage. The APK is in `apps/`.

## Test Architecture

- Use the Screen Object pattern.
- Create one screen object per application screen or cohesive feature. Extend or follow the conventions of `test/screenobjects/AppScreen.ts`.
- Keep selectors and screen-specific actions in screen objects. Keep assertions and user-facing behavior in specs.
- Create each spec in `test/specs/` around one screen or one cohesive feature.
- Use `test/specs/base.spec.e2e.ts` as the structural baseline:

  ```typescript
  describe("Screen or feature name", function () {
    it("describes the observable user behavior", async function () {});
  });
  ```

- Name every `it` with the behavior and observable outcome, not an implementation detail.
- Reset and control application state as needed so a test does not depend on another test's result.
- Reuse the existing application-reset hook for every test. Do not add new hooks for resetting, launching, or cleaning up the application.
- Synchronize on observable application state with WebdriverIO waits. Do not add arbitrary sleeps in new tests.

## Locator Strategy

Use the stable test identifiers documented for the Video QA Challenge in the assignment materials and application documentation. The locator priority is:

1. Accessibility ID, using WebdriverIO's `~identifier` selector.
2. Android UIAutomator selectors when no accessibility ID is available.
3. XPath only as a documented last resort because it is slow and brittle.

Do not use coordinates, visible text, view hierarchy positions, resource IDs inferred from the UI, or XPath when a documented accessibility identifier exists. Set `appium:disableIdLocatorAutocompletion` to `true` so an accessibility identifier is matched exactly.

## Adding a New Test

1. Review `TEST_PLAN.md` and `Test Assignment.pdf`; choose a scenario with a clear user-facing expected result.
2. Place the test in a focused spec under `test/specs/`, following `base.spec.e2e.ts`.
3. Add or update the appropriate screen object under `test/screenobjects/`. Reuse `AppScreen` for shared visibility behavior. Keep setup, navigation, and Debug Options orchestration in screen objects so specs contain only user-facing behavior and assertions.
4. Use documented Video QA Challenge test identifiers and the locator strategy above.
5. If scrolling is needed, use the existing methods in `test/helpers/gestures.ts`, such as `scrollUntilElementIsVisible`, `scrollOnScreen`, or `scrollToElementInList`. Do not implement ad hoc gestures in a spec.
6. For error, negative, or other non-happy-path scenarios, configure the application's Debug Options to select the required deterministic content or playback state. Do not simulate these states with mocks, network manipulation, or timing assumptions.
7. Reuse the existing application-reset hook. Do not create additional `before`, `beforeEach`, `afterEach`, or `after` hooks for application reset.
8. During development, mark the new test's associated Mocha test as exclusive:

   ```typescript
   it.only("describes the observable user behavior", async function () {
     // test steps
   });
   ```

9. Author and inspect the flow with the WebdriverIO MCP using the Android capabilities below. The MCP requires Appium to be running independently before the session starts; the WebdriverIO Appium service does not start it for MCP inspection. Select the APK from `apps/` as the application path when starting the MCP session.

   ```json
   {
     "platformName": "Android",
     "appium:automationName": "UIAutomator2",
     "appium:deviceName": "emulator-5554",
     "appium:udid": "emulator-5554",
     "appium:disableIdLocatorAutocompletion": true,
     "appium:allowInvisibleElements": true,
     "appium:enableMultiWindows": true
   }
   ```

10. After every production or test-code change, run the narrowest existing test that exercises the changed behavior. Verify a modified test with `it.only`; verify a modified spec with `describe.only`. Do not run unrelated specs while validating a focused change. Do not run the affected test only when the user explicitly directs otherwise. Immediately remove `.only` when validation is complete; it must never remain in a delivered test.
11. As part of the test-delivery output, generate an English prompt that can be reused to implement the same test again. Include the scenario, preconditions, Debug Options state when applicable, target screen objects, documented locators, actions, assertions, scrolling requirements, and the required MCP capabilities.

## Running Tests

Start an Android emulator before running tests. The WebdriverIO Appium service
starts the project-installed Appium server automatically, so no separate local
Appium installation or running server is required. If dependency installation
fails because the Appium service dependencies cannot be installed, temporarily
comment out the `services` section in `test/config/android.local.conf.ts`; the
test run will then require an externally running Appium server.

- To run one new test, temporarily add `.only` to its associated Mocha `it`; to run one changed spec, add `.only` to its `describe`; then run:

  ```bash
  npm run run.android.tests
  ```

- After every focused run, remove every `.only` marker. Run all Android tests only when explicitly required with:

  ```bash
  npm run run.android.tests
  ```

## Test Scope and Quality

Prioritize the required assignment flow: handle consent, select a random video card, start playback, and verify the `Playing` state. Use `test/helpers/videoCards.ts` and the Screen Object navigation methods to retain that same random card when a player flow leaves and returns to Details. Amsterdam is reserved for its exact metadata and required reference-detail scenarios. Use the risk-based scenarios from `TEST_PLAN.md` to add coverage for error recovery, buffering, pause/resume, completion, and controlled content states.

Tests must be deterministic, independent, readable, and based on observable user-facing state. Use the in-app Debug Options for error and non-happy-path states. Prefer explicit state setup and stable synchronization over timing assumptions.

## Regeneration Prompt

```text
Create an English-only Agents.md file for this repository. It is an Android-only technical-assignment project that tests the Video QA Challenge application; use TEST_PLAN.md and Test Assignment.pdf as the product and assignment sources of truth. The stack is TypeScript, WebdriverIO 9, Appium, and Mocha, and the APK is stored in apps/.

Document the Screen Object pattern, using test/screenobjects/AppScreen.ts as the base screen-object convention. Require focused specs under test/specs/, with one spec per screen or cohesive feature, and use test/specs/base.spec.e2e.ts as the describe/it structure. Require behavior-oriented it descriptions. Require catalogue and player flows to select a random card from test/helpers/videoCards.ts, scroll it through HomeScreen, and retain the same card for return-navigation flows; reserve Amsterdam for exact metadata and required reference-detail scenarios.

Define locator rules using the documented Video QA Challenge test identifiers and this priority: accessibility IDs first, Android UIAutomator second, XPath only as a last resort. State that appium:disableIdLocatorAutocompletion must be true and do not permit coordinate, text, inferred resource-ID, positional, or XPath locators when a documented accessibility identifier exists.

Add a detailed "Adding a New Test" section that requires setup, navigation, and Debug Options orchestration to remain in screen objects so specs are small, simple, and limited to user-facing behavior and assertions. Require reuse of test/helpers/gestures.ts for scrolling, require error, negative, and other non-happy-path scenarios to use the application's Debug Options rather than mocks, network manipulation, or timing assumptions, and require the associated Mocha it to use .only during development. Require every production or test-code change to run the narrowest existing test that exercises the changed behavior, unless the user explicitly directs otherwise. Require `describe.only` for focused validation of a changed spec and `it.only` for a changed test; do not run unrelated specs for focused changes. Require `.only` to be removed immediately after validation so it never remains in a delivered test. State that the existing application-reset hook must be reused and that no new before, beforeEach, afterEach, or after hooks may be added for application reset. Require an English reusable implementation prompt as part of every new-test delivery; it must include the scenario, preconditions, Debug Options state when applicable, screen objects, locators, actions, assertions, scrolling requirements, and MCP capabilities. Require use of the WebdriverIO MCP with exactly these capabilities:
{
  "platformName": "Android",
  "appium:automationName": "UIAutomator2",
  "appium:deviceName": "emulator-5554",
  "appium:udid": "emulator-5554",
  "appium:disableIdLocatorAutocompletion": true,
  "appium:allowInvisibleElements": true,
  "appium:enableMultiWindows": true
}
State that the MCP session must select the APK from apps/ and that Appium must be running independently before the MCP session starts; the WebdriverIO Appium service does not start Appium for MCP inspection.

Include running instructions: start an Android emulator, then temporarily run one changed test by adding .only to its it or one changed spec by adding .only to its describe, then execute npm run run.android.tests and remove .only after validation; run all tests by removing all .only markers and executing npm run run.android.tests only when explicitly required. State that the project-installed Appium server starts automatically through the WebdriverIO Appium service, so a separate local Appium installation or running server is not required. State that if dependency installation fails because the Appium service dependencies cannot be installed, the `services` section in `test/config/android.local.conf.ts` must be temporarily commented out and the test run must use an externally running Appium server. Include deterministic-state, explicit-wait, Debug Options, existing reset-hook, and risk-priority guidance from TEST_PLAN.md.
```
