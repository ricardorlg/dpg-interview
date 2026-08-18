# Requirements Document - Video QA Challenge

## 1. Purpose and Scope

The Android application presents a deterministic video catalogue, lets users
define consent preferences, and plays selected content. This scope is based on
the assignment brief, the existing test plan, and an exploration of
`VideoQAChallenge-debug.apk`.

The primary automated journey is: handle consent, open a randomly selected
catalogue video, view its details, start playback, and observe the `Playing`
state. The assignment reference journey for `Amsterdam from above` is covered
separately through its exact detail and metadata checks.

Out of scope: authentication, external services, real networking, iOS,
security, load testing, and broad visual-regression testing. The catalogue and
failure states are simulated and deterministic.

## 2. Functional Requirements

### 2.1 Consent

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| CON-01 | On the first launch after a clean installation, the app must show the privacy screen before the catalogue. | `Your privacy choices` is displayed and the user cannot reach the catalogue without making a decision. |
| CON-02 | The screen must explain that local preferences are stored and offer `Accept all`, `Reject optional`, and `Manage preferences`. | All three actions are visible and actionable. |
| CON-03 | The user must be able to accept all preferences or reject optional preferences. | Either decision navigates to the video catalogue. |
| CON-04 | The user must be able to choose optional preferences manually. | `Manage preferences` opens a flow where granular choices can be saved before continuing. |
| CON-05 | The consent decision must persist across app launches. | After accepting or rejecting, consent is not shown again when the app is relaunched. |

### 2.2 Video Catalogue (Home)

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| HOME-01 | The catalogue is the primary screen available after consent has been resolved. | The screen shows the `Video` title, the content list, refresh, and Debug Options actions. |
| HOME-02 | The catalogue must display a list of selectable videos. | Each card displays a default image/preview, title, duration, category, and publication date. |
| HOME-03 | Selecting a video must open its detail page. | Selecting `Amsterdam from above` opens a screen headed by that title. |
| HOME-04 | When the content response is empty, the app must show a distinct empty state without stale content and provide a retry/refresh action. | No cards are displayed; a no-videos message and a retry action are visible. |
| HOME-05 | When a simulated content error occurs, the app must show an error message and provide a retry/refresh action. | The error is distinguishable from the empty and loading states. |
| HOME-06 | When the content response is slow, the app must show a loading state before content appears. | Loading is visible and is not presented as an error. |

Content confirmed during exploration: `Amsterdam from above` (Travel, 15 July
2026, 02:30), `Inside the newsroom`, `Morning news update`, and additional
scrollable content.

### 2.3 Video Details

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| DET-01 | The page must identify the selected video and allow returning to the catalogue. | The header shows the video title and exposes a Back action. |
| DET-02 | The player must initially be shown in preview mode. | `Video preview` and a Play action are displayed; playback does not start automatically. |
| DET-03 | The detail page must display the video metadata. | Title, category/tag, description, publication date, and duration are shown. |
| DET-04 | `Amsterdam from above` metadata must be consistent with its catalogue entry. | The page shows `Travel`, `Explore Amsterdam and its surroundings from a different perspective.`, `Published 15 July 2026`, and `02:30`. |

### 2.4 Video Player

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| PLAY-01 | Playback must start only after the user presses Play from preview mode. | The interface changes to `Playing` and displays Pause, the current position, progress, and duration. |
| PLAY-02 | The user must be able to pause and resume playback. | Pause changes the state to `Paused`; resuming changes it back to `Playing`. |
| PLAY-03 | The current position and progress bar must advance during playback. | Both values change while the state is `Playing`. |
| PLAY-04 | On a simulated playback error, the app must report the failure and offer retry. | A message equivalent to `Video could not be played`, a retry action, and the `Error` state are shown; successful progress is not reported. |
| PLAY-05 | During long buffering, the app must represent the intermediate state and reach the configured outcome. | The player is not falsely presented as `Playing` before playback can begin. |
| PLAY-06 | Fast playback completion must expose a terminal state and must not remain `Playing`. | The product-defined final state is shown. |
| PLAY-07 | Playback progress must persist when leaving and returning to the detail page, unless explicitly cleared. | A video left, for example, at 00:25 resumes from that position when played again. |

## 3. Debug Options

Debug Options are available only from Home through the `Debug options` icon.
They provide deterministic test controls, not real-network simulation. They
must support the following states:

| Group | Options |
| --- | --- |
| Content response | `Success`, `Empty`, `Server error`, `Slow response` |
| Video response | `Normal playback`, `Long buffering`, `Playback error`, `Playback completes quickly` |
| State controls | `Reset consent`, `Clear playback progress`, `Restore default settings`, `Reset all app state` |

Changes are confirmed with `Done`. Reset controls must restore a known state so
tests can run independently.

## 4. Quality and Test Requirements

1. States must be validated through visible user-facing outcomes, not arbitrary
   time-based waits.
2. Tests must explicitly configure the required state in Debug Options and
   reuse the existing reset mechanism.
3. The priority flows are normal playback, pause/resume, playback error, and
   recovery from content error; then consent, details, buffering, and completion.
4. Android tests must use stable test identifiers: accessibility IDs first,
   Android UIAutomator selectors second, and XPath only as a last resort.

## 5. Assumptions

1. The application uses simulated content and makes no real backend calls.
2. Content and playback failures are activated through Debug Options, not
   external mocks, network manipulation, or timing assumptions.
3. Recovery after pressing retry in a content-error state is not included in
   the initially requested coverage, although the product exposes that action.
4. Each catalogue image is a default video preview rather than a remote asset.

## 6. Open Questions

| ID | Question | Impact |
| --- | --- | --- |
| OQ-01 | What is the maximum acceptable wait time for catalogue loading and playback start? | Defines timeouts and performance criteria. |
| OQ-02 | Should Home support pull-to-refresh in addition to the visible refresh action? | Defines manual refresh behaviour. |
| OQ-03 | What exactly should happen when a video completes: remain on details, restart, show `Completed`, or navigate back to the catalogue? | Defines the PLAY-06 acceptance criterion. |
| OQ-04 | What is the exact expected outcome of retrying after `Playback error`? | Defines error recovery and its test coverage. |
| OQ-05 | Should consent and playback progress persist across app relaunches, or only while navigating within a session? | Defines the lifetime of CON-05 and PLAY-07. |

## 7. Reusable Prompt

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
