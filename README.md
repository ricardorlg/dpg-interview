# Video QA Challenge - Android E2E Tests

Android end-to-end test automation for the deterministic Video QA Challenge
application. The suite covers consent, the video catalogue, video details, and
the player state machine.

## Solution Overview

The project uses TypeScript, WebdriverIO 9, Appium, UIAutomator2, and Mocha.
Appium and WebdriverIO were preferred by the assignment and provide a black-box
approach suitable for a final application build. The Screen Object architecture
keeps selectors and screen actions separate from user-facing specifications.

The test strategy began with manual exploratory testing, supported by AI, to
produce the requirements and risk-based test plan. Scenarios were then
implemented iteratively by screen and requirement, following the repository
rules in `Agents.md`.

## Documentation

| Document | Contents |
| --- | --- |
| [Requirements](REQUIREMENTS.md) | Functional requirements, acceptance criteria, assumptions, and open questions. |
| [Risk-Based Test Plan](TEST_PLAN.md) | Scope, risks, traceability, implemented coverage, known gaps, and future work. |
| [Submission](SUBMISSION.md) | Tooling rationale, delivery approach, execution report, AI usage, and actual time. |
| [Agent Instructions](Agents.md) | Test architecture, locator rules, state management, and authoring conventions. |
| [Prompt Library](PROMPT_LIBRARY.md) | Reusable English prompts for requirements, planning, implementation, and review. |

## Prerequisites

- Node.js and npm
- Android SDK and an Android emulator or device
- Appium server running on port `4723`
- An Android device available as `emulator-5554`, or equivalent values supplied
  through `.env.local`
- The APK at `apps/VideoQAChallenge-debug.apk`

## Running the Tests

1. Install project dependencies:

   ```bash
   npm install
   ```

2. Start the Android emulator or connect a supported Android device.

3. Start Appium on port `4723`.

4. Build the TypeScript project:

   ```bash
   npm run build
   ```

5. Run the Android end-to-end suite:

   ```bash
   npm run run.android.tests
   ```

The Android capabilities are configured in
`test/config/android.local.conf.ts`. The suite uses UIAutomator2 and exact
accessibility-ID matching through `appium:disableIdLocatorAutocompletion`.

## Allure Report

The test run writes results to `allure-results/`. Generate and open the report
after a run:

```bash
allure generate allure-results
allure open
```

## Latest Execution

The full Android emulator suite completed successfully with **21 passing tests**
in **3 minutes 0.5 seconds**. See [SUBMISSION.md](SUBMISSION.md) for the
execution environment and delivery details.

## Future Work

- Integrate Sauce Labs or BrowserStack to parallelize tests over a broader
  Android device matrix.
- Add iOS selectors and configuration while reusing shared scenarios and test
  logic.
- Implement the remaining planned scenarios documented in
  [TEST_PLAN.md](TEST_PLAN.md).
