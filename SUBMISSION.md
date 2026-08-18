# Video QA Challenge Submission

## Solution

This repository contains Android end-to-end tests for the deterministic Video QA
Challenge application.

### Tooling Decision

The solution uses TypeScript, WebdriverIO 9, Appium, and Mocha. Appium and
WebdriverIO were among the assignment's preferred tools, and I have used this
stack as a Senior QA Engineer for the past five years.

The application was available in a final, testable state, so a black-box
automation approach was more appropriate than a native Android option such as
Espresso. Appium exercises the installed application as a user would and offers
a direct path to iOS support: platform-specific selectors would need to be
added, but the scenarios, Screen Object structure, and test logic could remain
largely unchanged. This cross-platform reuse is preferable here to maintaining
separate native Espresso and XCUITest implementations.

### Delivery Approach

The work began with manual exploratory testing, supported by AI, to identify
the application's behavior, states, documented identifiers, and open questions.
That discovery informed `REQUIREMENTS.md`. The requirements then informed a
risk-based `TEST_PLAN.md`, created with AI support and the applicable
Briks-testing skills.

Tests are grouped by consent, catalogue, video details, and video player
behavior. Selectors and screen-specific actions live in `test/screenobjects/`;
specifications contain user actions and visible assertions. The suite uses
documented test identifiers, explicit WebdriverIO waits, the existing
application-reset hook, and deterministic Debug Options for controlled
non-happy-path states.

`Agents.md` defines clear, repository-specific instructions for the test
architecture, locator strategy, state control, and focused validation. Iterative
AI-assisted implementation then delivered scenarios one screen and requirement
at a time, with each result reviewed against the requirements, plan, and
application behavior.

`TEST_PLAN.md` contains the risk rationale, scenario traceability, implementation
status, open questions, and remaining coverage. `PROMPT_LIBRARY.md` contains
representative reusable prompts used for test and documentation work.

## Running the Tests

1. Start an Android emulator with device ID `emulator-5554`.
2. Start an Appium server on port `4723`.
3. Ensure `apps/VideoQAChallenge-debug.apk` is available.
4. Run `npm run build`.
5. Run `npm run run.android.tests`.

The Android configuration is in `test/config/android.local.conf.ts`. It targets
UIAutomator2 and enables exact accessibility-ID matching through
`appium:disableIdLocatorAutocompletion`.

## Test Execution Report

| Field | Record |
| --- | --- |
| Environments | Android emulator (`emulator-5554`) and a personal Android device, using Appium and UIAutomator2. |
| Primary environment rationale | The emulator was selected for convenience and repeatable local execution. |
| Latest audit validation | `npm run build` and `npm run eslint:check` completed successfully. |
| Full end-to-end result | `npm run run.android.tests` completed successfully on the Android emulator: 21 passing tests in 3 minutes 0.5 seconds; one Home-screen test passed on its first retry. |
| Test scope | Consent: 5 tests; Home: 5 tests; Video Details: 3 tests; Video Player: 8 tests. |
| Personal-device execution | The tests were also executed on a personal Android device. |

## Future Work

1. Integrate a device farm such as Sauce Labs or BrowserStack to run tests in
   parallel across a broader Android device matrix.
2. Add iOS support by supplying iOS selectors while reusing the existing
   scenarios, Screen Objects, and test logic where platform behavior is shared.
3. Complete the remaining planned scenarios recorded in `TEST_PLAN.md`.

## AI Usage

AI assistance supported manual exploratory-test analysis, requirements
documentation, risk-based test planning, scenario generation, implementation,
and documentation review. Briks-testing skills were used when planning and
reviewing coverage. Outputs were checked against `Test Assignment.pdf`,
`REQUIREMENTS.md`, `TEST_PLAN.md`, the documented test identifiers, and observed
application behavior. Representative reusable prompts are retained in
`PROMPT_LIBRARY.md`.

## Actual Time

**3 hours**
