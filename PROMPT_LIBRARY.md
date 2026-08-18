# Prompt Library

Reusable English prompts for the Video QA Challenge Android test project.

## Manual Android E2E GitHub Action

```text
Add a GitHub Actions workflow at `.github/workflows/android-e2e.yml` that runs
the Android E2E suite only through `workflow_dispatch`.

The repository is an Android-only Video QA Challenge project using TypeScript,
WebdriverIO 9, Appium 3.6.0, UIAutomator2, Mocha, and the APK at
`apps/VideoQAChallenge-debug.apk`. Use `actions/checkout@v7` to check out the
repository and `actions/setup-node@v7` with Node.js 24 and npm caching. Install
dependencies with `npm ci`, then verify the source with `npm run build`.

Use `reactivecircus/android-emulator-runner@v2` to create a headless Pixel 7 Pro
Android 16 emulator with API level 36, Google APIs, and x86_64 architecture.
Do not install or start Appium separately: the WebdriverIO Appium service starts
the project-installed server when `npm run run.android.tests` runs. If
dependency installation fails because the Appium service dependencies cannot be
installed, temporarily comment out the `services` section in
`test/config/android.local.conf.ts` and start an external Appium server before
executing `npm run run.android.tests`.

Set read-only repository permissions, a 30-minute job timeout, and a
branch-scoped concurrency group that cancels stale manual runs. Upload
`allure-results/` and the Appium log as a 14-day artifact whenever the run is
not cancelled. Do not add retries that could conceal flaky end-to-end tests, do
not require secrets, and keep all workflow labels and comments in English.
```

## Allure History and Android Version Matrix

```text
Plan and implement the next CI reporting and Android-compatibility improvements
for the Video QA Challenge Android E2E project. Keep all code, workflow labels,
comments, and documentation in English.

The existing `.github/workflows/android-e2e.yml` workflow uses
`workflow_dispatch`, runs the full suite on an Android 16 (API level 36) Google
APIs Pixel 7 Pro emulator, generates an Allure report, and deploys it to GitHub
Pages. Android 16 is the default because it is convenient and repeatable for
local and GitHub-hosted CI execution.

Add a workflow-dispatch Android-version input that defaults to Android 16 and
drives the emulator API level through an explicit, documented mapping. Validate
unsupported input values clearly. Do not run multiple Android emulators in
parallel on GitHub-hosted runners: operating a multi-version emulator matrix
there is costly and difficult. Document a future migration to a device farm such
as Sauce Labs or BrowserStack for parallel coverage across supported Android
versions and devices.

Persist Allure execution history across GitHub Pages deployments. Before
generating a report, retrieve the prior published report when it exists and copy
its `history` directory into `allure-results/history`; then generate and deploy
the next report. The first run must succeed when no history exists. Retain
existing JUnit reporting, Appium-log artifacts, manual triggering, concurrency,
and the published Pages report. Update README.md, TEST_PLAN.md, and
SUBMISSION.md with the Android 16 rationale, the version parameter, device-farm
future work, and Allure-history behavior. Do not claim that a multi-version
matrix or historical data is available until the workflow implements it.
```

## Project README

```text
Create an English-only README.md for the Video QA Challenge Android E2E test
repository. Make it a concise entry point to REQUIREMENTS.md, TEST_PLAN.md,
SUBMISSION.md, Agents.md, and PROMPT_LIBRARY.md. Explain that the stack is
TypeScript, WebdriverIO 9, Appium, UIAutomator2, and Mocha, and describe the
black-box Screen Object approach.

Include prerequisites for Node.js/npm, Android SDK and an emulator or device,
and apps/VideoQAChallenge-debug.apk. State that the WebdriverIO Appium service
starts the project-installed Appium server automatically, so a separate local
Appium installation or running server is not required. Explain that, if
dependency installation fails because the Appium service dependencies cannot be
installed, the `services` section in `test/config/android.local.conf.ts` should
be temporarily commented out and an external Appium server must be used. Give
exact commands in this order:
1. npm install
2. npm run build
3. npm run run.android.tests

Document that Allure results are stored in allure-results/ and provide:
allure generate allure-results
allure open

Do not duplicate the full requirements or test plan; link to their source
documents. Include the latest verified execution result only when it is known,
and keep future-work items aligned with TEST_PLAN.md and SUBMISSION.md.
```

## GitHub Actions CI/CD Documentation

```text
Update the English documentation for the Video QA Challenge Android E2E test
repository to describe the existing manually triggered GitHub Actions workflow.
Use `.github/workflows/android-e2e.yml` as the source of truth; do not change
the workflow unless explicitly requested.

Update README.md and SUBMISSION.md with an actionable step-by-step guide:
1. Open the repository on GitHub and select the Actions tab.
2. Select the `Android E2E Tests` workflow.
3. Click Run workflow.
4. Select the branch to validate and click Run workflow again.
5. Open the completed run to review the test summary, Appium log artifact, and
   Allure report.

Explain that the workflow uses `workflow_dispatch`, checks out the selected
branch, enables KVM, configures Node.js and npm caching, installs locked
dependencies with `npm ci`, starts the Android emulator defined in the workflow,
and executes `npm run run.android.tests`. Document only the reports and
artifacts actually produced by the workflow: merged JUnit results in GitHub
Actions, the Appium log artifact, and the generated Allure HTML report deployed
to GitHub Pages.

Add a new CI/CD section to TEST_PLAN.md. Explain the deterministic CI execution
environment, the manual trigger rationale, the execution evidence retained, and
the workflow concurrency behavior when it is configured. Link to the published
Allure report using exactly:
https://ricardorlg.github.io/dpg-interview/

Keep documentation concise, accurate to the workflow, and in English. Do not
invent successful runs, artifact-retention periods, required checks, scheduled
triggers, secrets, retries, or coverage gates that are not present in the
workflow. Validate Markdown formatting and internal file references after the
update.
```

## Video Details Preview State

```text
Extend the existing Video Details Android E2E test for the Video QA Challenge
application. Use TypeScript, WebdriverIO 9, Appium, and Mocha. Update the
existing test that opens `Amsterdam from above`, rather than creating a separate
spec or duplicating navigation.

Source of truth:
- REQUIREMENTS.md: DET-02
- TEST_PLAN.md: P1-01 and P1-02
- Agents.md

Before pressing Play, assert the user-visible initial player state: `Video
preview` is displayed, the documented `id=video_play_button` action is visible,
and `id=video_pause_button` does not exist. Retain the existing title and Back
assertions. Keep player selectors in `test/screenobjects/components/VideoPlayer.ts`;
the preview label has no documented ID, so use an Android UIAutomator text
selector there. Keep the spec selector-free apart from screen-object access.

Use the existing reset hook and add `describe.only` while validating only this
changed spec with `npm run run.android.tests`; remove `.only` immediately after
the focused run. Inspect the APK at apps/VideoQAChallenge-debug.apk with the
WebdriverIO MCP using:
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

## Test Coverage Audit

```text
Review the completed Android E2E suite for the Video QA Challenge before adding
new tests. Use REQUIREMENTS.md, TEST_PLAN.md, Test Assignment.pdf, Agents.md,
and every file under test/specs/ as the sources of truth. The project uses
TypeScript, WebdriverIO 9, Appium, and Mocha; Android is the only supported
platform and the APK is in apps/.

Create a scenario-by-scenario traceability assessment. For every TEST_PLAN.md
scenario, classify it as Implemented, Partially implemented, Not implemented,
or Out of scope. Cite the exact spec and test name for implemented coverage.
Compare each implemented assertion with the relevant requirement acceptance
criterion. Identify gaps, duplicate coverage, exclusive it.only or describe.only
markers, weak assertions, arbitrary waits in specs, and missing screen-object
support for planned Debug Options controls.

Do not claim planned coverage is implemented. Update TEST_PLAN.md in English
with an implementation-coverage status table and accurate exit criteria. Update
REQUIREMENTS.md only where it contradicts the implemented test strategy or the
assignment. Compare the Test Assignment.pdf deliverables with the repository and
add or update English submission documentation for missing solution, run,
execution-report, AI-usage, and time-recording information without inventing
execution results or elapsed time. Do not add tests unless explicitly requested.
Remove all exclusive Mocha markers before delivery.

Validate the documentation and code references with npm run build. Return a
concise English summary of implemented coverage, uncovered scenarios, and every
documentation change.
```

## Requirements Document

Source: `REQUIREMENTS.md`

```text
Create an English-only requirements document named REQUIREMENTS.md for the
Video QA Challenge Android application. Use Test Assignment.pdf and
TEST_PLAN.md as the authoritative product and assignment sources. Explore the
APK at apps/VideoQAChallenge-debug.apk with WebdriverIO MCP before writing.
Appium is already running; start the Android session with exactly:

{
  "platformName": "Android",
  "appium:automationName": "UIAutomator2",
  "appium:deviceName": "emulator-5554",
  "appium:udid": "emulator-5554",
  "appium:disableIdLocatorAutocompletion": true,
  "appium:allowInvisibleElements": true,
  "appium:enableMultiWindows": true
}

Document the scope, functional requirements, acceptance criteria, assumptions,
and open questions. Cover:

- Consent: first-launch display, accept all, reject optional, manage granular
  preferences, and persistence.
- Home/video catalogue: post-consent access, selectable video cards, metadata,
  empty state, server-error state, slow response, refresh, and navigation to
  details.
- Video details: title, preview player, back navigation, category, description,
  publication date, and duration. Include the confirmed `Amsterdam from above`
  metadata.
- Player: explicit Play action, Playing/Paused transitions, progress, buffering,
  playback error and retry, completion, and retained playback progress.
- Debug Options: state that they are accessible only from Home and list content
  response controls, video response controls, and reset controls.

Give each requirement a stable ID and include an observable acceptance
criterion. Clearly distinguish confirmed behaviour, assumptions, and unresolved
product decisions. Do not invent real backend or networking behaviour. Use
English throughout and close the WebdriverIO MCP session after exploration.
```

## Risk-Based Test Plan

Source: `TEST_PLAN.md` (reusable prompt derived from the documented plan scope)

```text
Create an English-only risk-based test plan named TEST_PLAN.md for the Video QA
Challenge Android application. Use Test Assignment.pdf and REQUIREMENTS.md as
the authoritative sources. The application is a deterministic video demo with
consent, a video catalogue, video details, a player state machine, and Debug
Options.

Define the purpose, scope decision, risk model, automated coverage, coverage
rationale, traceability, test independence, entry and exit criteria, open
questions, and execution order.

Prioritize the mandatory journey as P0: resolve consent, select a random
catalogue video, verify its details, start playback, and observe `Playing`.
Reserve Amsterdam for exact metadata and required reference-detail scenarios.

Include P0 coverage for:
- First-launch consent, accept all, reject optional, granular preferences, and
  consent persistence.
- Catalogue availability after consent, including successful, empty, server
  error, slow-loading, refresh, and recovery states.
- Starting normal playback for a random video, observable Playing state,
  progress, pause/resume, playback error, retry, and recovery. Retain the
  selected card when a player flow returns to Details.

Include P1 coverage for:
- Catalogue-to-details navigation, Amsterdam metadata, preview state, and back
  navigation.
- Long buffering, fast completion, retained and cleared playback progress.
- Debug Options state changes, restoring defaults, resetting consent, and
  resetting all app state.

Include P2 coverage for full-catalogue scrolling, representative additional
content, and repeated state transitions. Explicitly exclude individual
rendered-video-frame validation.

Use deterministic Debug Options for non-happy-path states. Require visible
user-facing assertions, explicit state setup, stable waits, and independent
tests. Do not rely on real networking, mocks, or arbitrary timing. Give each
scenario a stable ID, requirement traceability, priority, and expected outcome.
Document unresolved product decisions separately.
```

## Agent Instructions

Source: `Agents.md`

```text
Create an English-only Agents.md file for this repository. It is an Android-only technical-assignment project that tests the Video QA Challenge application; use TEST_PLAN.md and Test Assignment.pdf as the product and assignment sources of truth. The stack is TypeScript, WebdriverIO 9, Appium, and Mocha, and the APK is stored in apps/.

Document the Screen Object pattern, using test/screenobjects/AppScreen.ts as the base screen-object convention. Require focused specs under test/specs/, with one spec per screen or cohesive feature, and use test/specs/base.spec.e2e.ts as the describe/it structure. Require behavior-oriented it descriptions.

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
State that the MCP session must select the APK from apps/.

Include running instructions: temporarily run one changed test by adding .only to its it or one changed spec by adding .only to its describe, then execute npm run run.android.tests and remove .only after validation; run all tests by removing all .only markers and executing npm run run.android.tests only when explicitly required. Include deterministic-state, explicit-wait, Debug Options, existing reset-hook, and risk-priority guidance from TEST_PLAN.md.
```

## Consent Screen Tests

```text
Add Android E2E coverage for the Video QA Challenge Consent screen using
TypeScript, WebdriverIO 9, Appium, and Mocha.

Sources of truth:
- REQUIREMENTS.md: CON-01 through CON-05
- TEST_PLAN.md: P0-01 through P0-05
- Agents.md

Create:
- test/screenobjects/ConsentScreen.ts
- test/screenobjects/PreferencesScreen.ts
- test/screenobjects/HomeScreen.ts
- test/specs/consent.spec.e2e.ts

Follow the Screen Object pattern. Keep selectors and actions in screen objects;
keep assertions in the spec. Reuse the existing application-reset hook. Do not
call browser.resetAndroidApp() inside tests and do not add hooks.

Add an empty `navigateTo()` method to `AppScreen`. Override it in `HomeScreen`
to resolve ConsentScreen by accepting all preferences and wait for Home to be
shown. Specs must navigate through `homeScreen.navigateTo()` rather than
handling consent directly.

Add `HomeScreen.setDebugOption(option)` to open Debug Options, select the
option, and save it. Specs must call that method and must not import or
orchestrate `DebugOptionsScreen`.

Use these direct Android resource-ID selectors:
- `id=consent_accept_button`
- `id=consent_reject_button`
- `id=consent_manage_preferences_button`
- `id=preferences_save_button`
- `id=analytics_toggle`
- `id=personalisation_toggle`
- `id=content_overview_screen`

Keep the spec limited to navigation, user-facing actions, and assertions.
Implement these exclusive Mocha tests with it.only during development:
1. A clean launch shows "Your privacy choices" and all three consent actions,
   while the Video catalogue is unavailable.
2. Selecting Accept all opens the Video catalogue and removes the consent action.
3. Selecting Reject optional opens the Video catalogue and removes the consent
   action.
4. Selecting Manage preferences opens Preferences, shows Analytics and
   Personalised content controls, saves a granular choice, and opens the Video
   catalogue.
5. Accepting preferences, terminating, and reactivating com.videoqa.challenge
   keeps the Video catalogue visible without showing consent again.

Use explicit WebdriverIO visibility waits and user-facing assertions only. Do
not use arbitrary sleeps, coordinates, XPath, text locators when a documented
resource ID exists, mocks, or network manipulation.

Use WebdriverIO MCP with:
{
  "platformName": "Android",
  "appium:automationName": "UIAutomator2",
  "appium:deviceName": "emulator-5554",
  "appium:udid": "emulator-5554",
  "appium:disableIdLocatorAutocompletion": true,
  "appium:allowInvisibleElements": true,
  "appium:enableMultiWindows": true
}

Select apps/VideoQAChallenge-debug.apk. Validate with:
npm run build
npm run run.android.tests
```

## Video Details Screen Tests

```text
Add Android E2E coverage for the Video QA Challenge Video Details screen using
TypeScript, WebdriverIO 9, Appium, and Mocha.

Sources of truth:
- REQUIREMENTS.md: DET-01, DET-03, and DET-04
- TEST_PLAN.md: P1-01, P1-03, and P1-04
- Agents.md

Create or update:
- test/helpers/videoCards.ts
- test/screenobjects/HomeScreen.ts
- test/screenobjects/VideoDetailsScreen.ts
- test/specs/video-details.spec.e2e.ts

This spec covers selecting a video and reviewing its details only. Confirm that
the player surface is visible, but do not test playback state, controls,
progress, buffering, completion, or errors.

Extend the video-card helper with `VideoDetailsData` and
`getAmsterdamVideo()`. It must provide the Amsterdam card data plus:
- description: `Explore Amsterdam and its surroundings from a different perspective.`
- publicationDate: `15 July 2026`

Keep selectors and actions in screen objects; keep specs limited to navigation,
user-facing behavior, and assertions. Do not use selectors in the spec.

Add `HomeScreen.openVideoDetails(data)` to scroll the card into view through the
existing scrolling helper, select it, and open Details. Override
`VideoDetailsScreen.navigateTo()` to navigate through Home and open Amsterdam.
Use:
- `id=detail_title`
- `id=detail_category`
- `id=detail_description`
- `id=video_play_button` for the visible player surface
- `id=detail_back_button`
- Android UIAutomator `textMatches` for the combined publication date and
  duration, using `\\s+` so variable whitespace does not make the selector
  brittle; this field has no documented resource ID.

Implement these tests:
1. The selected Amsterdam video opens Details with its title, visible player
   surface, and a Back action.
2. Details display Amsterdam's title, category, description, publication date,
   and duration.
3. Selecting Back returns to the content overview and hides the Details title.

Temporarily validate this changed spec with `describe.only`, run
`npm run run.android.tests`, then remove `.only` immediately. Do not run
unrelated specs for focused validation.

Use WebdriverIO MCP with:
{
  "platformName": "Android",
  "appium:automationName": "UIAutomator2",
  "appium:deviceName": "emulator-5554",
  "appium:udid": "emulator-5554",
  "appium:disableIdLocatorAutocompletion": true,
  "appium:allowInvisibleElements": true,
  "appium:enableMultiWindows": true
}

Select apps/VideoQAChallenge-debug.apk.
```

## Home Screen Tests

```text
Add Android E2E coverage for the Video QA Challenge Home screen using
TypeScript, WebdriverIO 9, Appium, and Mocha.

Sources of truth:
- REQUIREMENTS.md: HOME-01 through HOME-06
- TEST_PLAN.md: P0-06 through P0-10
- Agents.md

Create or update:
- test/helpers/videoCards.ts
- test/screenobjects/components/HomeVideoCard.ts
- test/screenobjects/HomeScreen.ts
- test/screenobjects/DebugOptionsScreen.ts
- test/specs/home.spec.e2e.ts

Follow the Screen Object pattern. Keep selectors and actions in screen objects;
keep assertions in the spec. Reuse the existing application-reset hook. Do not
call browser.resetAndroidApp() inside tests and do not add hooks.

Create `test/helpers/videoCards.ts`, which returns a JSON-compatible array of
catalogue cards. Each item must include `id`, `title`, `tag`, and `duration`.
Populate the values by exploring the deterministic APK with WebdriverIO MCP.
Add a concise comment stating that a production project would retrieve this
catalogue from the backend. Provide a helper that selects one item at random.
The explored catalogue is:
- `content_item_amsterdam`: `Amsterdam from above`, `Travel`, `02:30`
- `content_item_newsroom`: `Inside the newsroom`, `News`, `04:05`
- `content_item_morning`: `Morning news update`, `News`, `01:35`
- `content_item_technology`: `Technology of tomorrow`, `Technology`, `05:20`
- `content_item_travel`: `Weekend travel guide`, `Travel`, `03:30`
- `content_item_interview`: `Interview of the day`, `Interviews`, `06:40`

Create `HomeVideoCard` under `test/screenobjects/components/`. It must represent
one Home card and encapsulate its root, title, tag, and duration selectors.

Resolve consent in each test by using ConsentScreen to accept all preferences,
then wait for HomeScreen. Use these direct Android resource-ID selectors:
- `id=content_overview_screen`
- `id=content_refresh_button`
- `id=debug_options_button`
- `id=content_empty_retry_button`
- `id=content_error_message`
- `id=content_error_retry_button`
- `id=content_loading_indicator`
- `id=debug_content_success`
- `id=debug_content_empty`
- `id=debug_content_error`
- `id=debug_content_slow`
- `id=debug_done_button`

Use Android UIAutomator text selectors only inside the `HomeVideoCard` component
for tag and duration, because those values do not expose documented IDs. Use a
directly generated resource-ID selector for the card title. Use the existing
`scrollUntilElementIsVisible` helper to scroll a selected card into view; do not
implement a new gesture.

Implement these exclusive Mocha tests with it.only during development:
1. After consent is resolved, show the content overview, refresh and Debug
   Options actions, then select a random card from the helper, scroll it into
   view, and assert its title, tag, and duration through `HomeVideoCard`.
2. Select Empty in Debug Options, choose Done, and show a retryable empty state
   with no randomly selected card.
3. Select Server error in Debug Options, choose Done, and show
   `We could not load the videos`, a retry action, no empty-state retry action,
   and no randomly selected card.
4. Configure Server error, confirm the error state, then configure Success,
   choose Done, refresh the catalogue, scroll a randomly selected card into
   view, and show it without the error.
5. Select Slow response in Debug Options, choose Done, and show the loading
   indicator while neither an error nor the randomly selected card is shown;
   then scroll that card into view and show it when loading completes.

Use explicit WebdriverIO visibility waits and user-facing assertions only. Do
not use arbitrary sleeps, coordinates, XPath, selectors in specs, text locators
when a documented resource ID exists, mocks, or network manipulation.

Use WebdriverIO MCP with:
{
  "platformName": "Android",
  "appium:automationName": "UIAutomator2",
  "appium:deviceName": "emulator-5554",
  "appium:udid": "emulator-5554",
  "appium:disableIdLocatorAutocompletion": true,
  "appium:allowInvisibleElements": true,
  "appium:enableMultiWindows": true
}

Select apps/VideoQAChallenge-debug.apk. Validate with:
npm run build
npm run run.android.tests
```

## Home Video Card Metadata Visibility

```text
Fix the `HomeVideoCard.checkContent()` Android E2E screen-object method so it
does not assume every metadata element is visible after `HomeScreen` scrolls
the card root into view. On small devices, a card near the end of the catalogue
can have a partially visible root while its title, category, or duration is
outside the viewport.

Source of truth:
- TEST_PLAN.md: P0-06 and P2-01
- Test Assignment.pdf
- Agents.md

Update only `test/screenobjects/components/HomeVideoCard.ts` and directly
related documentation. Keep the existing root visibility assertion. Before
asserting each non-root metadata element, use the existing
`scrollUntilElementIsVisible` helper from `test/helpers/gestures.ts` with
`ScrollDirection.UP` and a maximum of five scroll attempts:
1. Scroll the title (`id=content_title_*`) into view, then assert its expected
   text. Supply an error-message callback stating that the title element was not
   found after five scroll attempts.
2. Scroll the category tag (Android UIAutomator text selector) into view, then
   assert it is displayed. Supply an error-message callback stating that the
   category element was not found after five scroll attempts.
3. Scroll the duration (Android UIAutomator text selector) into view, then
   assert it is displayed. Supply an error-message callback stating that the
   duration element was not found after five scroll attempts.

Do not add gestures, arbitrary waits, coordinates, XPath locators, test hooks,
or selectors to specs. Keep the Screen Object pattern: scrolling and
screen-specific synchronization belong in `HomeVideoCard`, and user-facing
assertions remain in the spec. Preserve the documented locator strategy and
use the existing application-reset hook.

Inspect the APK at `apps/VideoQAChallenge-debug.apk` with WebdriverIO MCP using:
{
  "platformName": "Android",
  "appium:automationName": "UIAutomator2",
  "appium:deviceName": "emulator-5554",
  "appium:udid": "emulator-5554",
  "appium:disableIdLocatorAutocompletion": true,
  "appium:allowInvisibleElements": true,
  "appium:enableMultiWindows": true
}

Temporarily add `it.only` to the affected Home test while validating with
`npm run run.android.tests`, then remove `.only` immediately. Run
`npm run build` to type-check the change.
```

## Video Player Tests

```text
Add Android E2E coverage for the Video QA Challenge player using TypeScript,
WebdriverIO 9, Appium, and Mocha.

Sources of truth:
- REQUIREMENTS.md: PLAY-01 through PLAY-07
- TEST_PLAN.md: P0-11 through P0-14 and P1-05 through P1-08
- Agents.md

Create or update:
- test/screenobjects/components/VideoPlayer.ts
- test/screenobjects/DebugOptionsScreen.ts
- test/screenobjects/HomeScreen.ts
- test/screenobjects/VideoDetailsScreen.ts
- test/specs/video-player.spec.e2e.ts

Use a VideoPlayer component to contain all player selectors, state synchronization,
and actions. Keep the spec selector-free, short, and limited to user actions and
observable assertions. Extend DebugOptionsScreen with these documented video
response IDs:
- id=debug_video_normal
- id=debug_video_buffering
- id=debug_video_error
- id=debug_video_complete_quickly

Keep Debug Options orchestration in screen objects. HomeScreen must select and
save video responses and clear playback progress; specs must not interact with
DebugOptionsScreen directly. Player scenarios must select a random card using
test/helpers/videoCards.ts and navigate through HomeScreen, which waits for the
catalogue list and at least one `content_item_*` resource before scrolling.
VideoDetailsScreen.navigateToRandomVideo(videoResponse) must configure the
response, open a random card, and return its data. Use
VideoDetailsScreen.openVideoFromHome(selectedVideo) after returning to Home so
progress scenarios reopen the same randomly selected video.

Use these player selectors only inside VideoPlayer:
- id=video_play_button
- id=video_pause_button
- id=video_current_position
- id=video_progress
- id=video_duration
- id=video_state_label
- id=video_buffering_indicator
- id=video_error_message
- id=video_retry_button

Implement and assert these user-facing scenarios:
1. Normal playback reaches Playing and shows Pause, current position, progress,
   and duration; position and progress advance using an explicit state wait.
2. Pause changes Playing to Paused, and Play resumes it to Playing.
3. A configured playback error shows Error, `Video could not be played`, Retry,
   and zero successful position/progress.
4. Retrying while the error remains configured preserves the Error outcome and
   does not report a false success.
5. Long buffering shows Buffering and its indicator without falsely reporting
   Playing or progress.
6. Playback completes quickly and reaches Completed with the terminal 00:30
   position and full progress.
7. Leaving a random video after progress advances and reopening that same card
   resumes at or after the retained position.
8. Clearing playback progress through Debug Options causes a newly played video
   to begin at 00:00 with zero progress.

Use browser.waitUntil only for observable state transitions or progress changes;
do not use arbitrary sleeps. Reuse the existing reset hook. Do not call
browser.resetAndroidApp() or add hooks. Add describe.only while developing this
entire spec, run npm run build and npm run run.android.tests, and remove .only
immediately after the focused validation passes.

Use WebdriverIO MCP with:
{
  "platformName": "Android",
  "appium:automationName": "UIAutomator2",
  "appium:deviceName": "emulator-5554",
  "appium:udid": "emulator-5554",
  "appium:disableIdLocatorAutocompletion": true,
  "appium:allowInvisibleElements": true,
  "appium:enableMultiWindows": true
}

Select apps/VideoQAChallenge-debug.apk.
```
