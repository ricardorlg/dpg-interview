# Video QA Challenge Android - Risk-Based Test Plan

## Purpose

This plan defines the automated test coverage for the Video QA Challenge Android
application. It is based on the assignment, `REQUIREMENTS.md`, and exploration of
the deterministic debug APK.

The mandatory journey is handled as a single critical path: resolve consent, open
a random catalogue video, verify its details, start playback, and observe `Playing`.
All documented functional requirements are in scope for automation and are ordered
by risk and user impact.

## Scope Decision

The only excluded check is validation of the individual video frames rendered by
the player. Frame-by-frame media validation requires a separate visual-media
oracle and does not affect the application's observable control, navigation, or
state-machine behavior.

All other documented behavior, including consent, catalogue states, navigation,
metadata, playback states, persistence, retry, refresh, and Debug Options, is in
scope for automation.

## Risk Model

Risk score = user impact (1-5) x likelihood of functional regression (1-5).

| Risk area | Impact | Likelihood | Score | Priority | Automation decision |
| --- | ---: | ---: | ---: | --- | --- |
| Player state machine, playback controls, progress, error recovery, and completion | 4 | 4 | 16 | P0 | Fully automate normal, transitional, terminal, and error states. |
| Consent gate, preference choices, and persistence | 4 | 3 | 12 | P0 | Fully automate first launch, every decision path, granular preferences, reset, and relaunch persistence. |
| Catalogue availability, loading, empty, error, retry, refresh, and state recovery | 4 | 3 | 12 | P0 | Fully automate each configured response and recovery path. |
| Content-to-detail navigation and metadata integrity | 3 | 3 | 9 | P1 | Automate Amsterdam as the required reference item and representative catalogue navigation. |
| Detail-page preview and back navigation | 3 | 2 | 6 | P1 | Automate initial player state, metadata, and return navigation. |
| Debug Options configuration and reset controls | 3 | 2 | 6 | P1 | Automate state selection, confirmation, restore defaults, and complete reset. |
| Player-frame correctness | 2 | 2 | 4 | Out of scope | Do not automate individual rendered-frame validation. |

## Automated Coverage

### P0 - Critical User Access, Availability, and Playback

| Test ID | Requirements | Scenario | Expected outcome |
| --- | --- | --- | --- |
| P0-01 | CON-01, CON-02 | Start from a clean state. | Privacy choices appear before the catalogue; all three consent actions are visible and actionable. |
| P0-02 | CON-03 | Accept all preferences. | The catalogue opens. |
| P0-03 | CON-03 | Reject optional preferences. | The catalogue opens. |
| P0-04 | CON-04 | Manage preferences and save granular choices. | The granular-preference flow opens; saved choices allow the user to continue to the catalogue. |
| P0-05 | CON-05 | Relaunch after accepting or rejecting consent. | Consent is not displayed again. |
| P0-06 | HOME-01, HOME-02 | Open the catalogue after consent and select a random video card. | The Video heading, content list, refresh action, Debug Options action, and the selected card's preview, title, duration, and category are shown. |
| P0-07 | HOME-04 | Configure an empty content response. | A distinct no-videos state appears without stale cards and offers retry or refresh. |
| P0-08 | HOME-05 | Configure a server content error. | A distinct error message and retry or refresh action appear. |
| P0-09 | HOME-05 | Recover from a content error and select a random video card. | After restoring successful content and retrying or refreshing, the usable catalogue returns and the selected card is shown. |
| P0-10 | HOME-06 | Configure a slow content response for a random video card. | A loading state is visible before the selected card appears and is not presented as an error. |
| P0-11 | PLAY-01, PLAY-03 | Open a random video and press Play from preview. | The player reaches `Playing`; Pause, current position, progress, and duration appear; position and progress advance. |
| P0-12 | PLAY-02 | Pause and resume a randomly selected active video. | Pause changes the state to `Paused`; resume changes it back to `Playing`. |
| P0-13 | PLAY-04 | Configure playback error and press Play on a random video. | The player shows the Error state, a failure message, and retry; successful progress is not reported. |
| P0-14 | PLAY-04 | Retry while a playback error remains configured for a random video. | The error remains visible with no false successful progress. Recovery after changing the Debug Options response is covered once its product behavior is defined. |

### P1 - Navigation, Playback Boundaries, and State Control

| Test ID | Requirements | Scenario | Expected outcome |
| --- | --- | --- | --- |
| P1-01 | HOME-03, DET-01 | Select `Amsterdam from above` from the catalogue. | The Amsterdam detail page opens with its title in the header and a Back action. |
| P1-02 | DET-02 | Open Amsterdam before starting playback. | The player remains in preview mode, shows `Video preview` and Play, and does not start automatically. |
| P1-03 | DET-03, DET-04 | Review Amsterdam details. | The title, Travel category, description, publication date, and `02:30` duration match the catalogue entry. |
| P1-04 | DET-01 | Return from details to the catalogue. | The catalogue is restored without incorrect content or navigation state. |
| P1-05 | PLAY-05 | Configure long buffering and start a random video. | The intermediate state is represented; the player is not falsely shown as `Playing` before the configured outcome. |
| P1-06 | PLAY-06 | Configure fast playback completion for a random video. | The product-defined terminal state is shown and the player does not remain `Playing`. |
| P1-07 | PLAY-07 | Leave a random video after playback progress has advanced, return to that same video, and play again. | Playback resumes from retained progress unless that progress has been explicitly cleared. |
| P1-08 | PLAY-07, Debug state controls | Clear playback progress and return to the same random video. | Playback begins at the cleared initial position. |
| P1-10 | Debug state controls | Restore default settings. | Default successful content and normal playback behavior return. |
| P1-11 | Debug state controls | Reset consent and reset all app state. | Consent returns after its reset; the complete reset restores a known initial state. |

### P2 - Full Catalogue and Repetition Coverage

| Test ID | Requirements | Scenario | Expected outcome |
| --- | --- | --- | --- |
| P2-01 | HOME-02 | Scroll through the full catalogue. | All available cards remain selectable and each continues to display preview, title, duration, category, and publication date. |
| P2-02 | HOME-03, DET-01, DET-03 | Open another catalogue item and return. | Detail navigation, metadata presence, and Back behavior are consistent beyond the mandatory Amsterdam item. |
| P2-03 | HOME-04, HOME-05, HOME-06 | Repeat empty, error, and slow content states after an earlier successful load. | Stale successful cards are never retained in the empty, error, or loading state. |
| P2-04 | CON-05, PLAY-07 | Repeat relaunch persistence checks after normal navigation and playback. | Consent and playback persistence continue to meet their documented lifetime requirements. |

## Implementation Coverage Status

The scenarios above define the intended scope. The table below records the
coverage implemented in `test/specs/` as of the latest suite review; it avoids
presenting planned scenarios as completed automation.

| Status | Scenarios | Evidence |
| --- | --- | --- |
| Implemented | P0-01 through P0-14 | `consent.spec.e2e.ts`, `home.spec.e2e.ts`, and `video-player.spec.e2e.ts` |
| Implemented | P1-01 through P1-08 | `video-details.spec.e2e.ts` and `video-player.spec.e2e.ts` |
| Not implemented | P1-10 | No scenario restores the default content and normal-playback settings. |
| Not implemented | P1-11 | No scenario resets consent or all application state and verifies the resulting initial state. |
| Not implemented | P2-01 through P2-04 | The suite does not cover the full catalogue, additional-item navigation, repeated controlled states, or persistence after normal navigation and playback. |

Debug Options are exercised as deterministic setup for the implemented
non-happy-path scenarios. Dedicated confirmation behavior is not a core
coverage objective, so the former P1-09 scenario is intentionally out of scope.

## Future Work

| Scenario | Resolution approach |
| --- | --- |
| P1-10 | Inspect the APK to confirm the restore-defaults identifier and behavior, add its action to `DebugOptionsScreen` and `HomeScreen`, then assert successful content and normal playback after restoration. |
| P1-11 | Confirm the reset-consent and reset-all identifiers and their exact persistence effects. Add screen-object actions, then verify the consent gate and known initial application state independently. |
| P2-01 | Iterate deterministically through `getVideoCards()`, scrolling each card into view and asserting its documented card metadata and selectability. |
| P2-02 | Add a fixed non-Amsterdam reference card with confirmed detail metadata, then verify Details navigation and Back without reusing the Amsterdam-specific oracle. |
| P2-03 | Start from successful content, configure empty, server-error, and slow states in separate independent tests, and assert that no previously loaded card remains visible. |
| P2-04 | Define the intended relaunch persistence lifetime, then combine post-playback navigation, app relaunch, consent, and retained-progress assertions in independent scenarios. |
| Allure execution history | Persist the previous published report's `history` directory before generating the next Allure report, then publish the updated report so trend and historical execution data remain available. |
| Android-version parameter and matrix | Add a `workflow_dispatch` input for the Android version. Keep Android 16 as the default because it was selected for convenient, repeatable local and CI execution. GitHub-hosted CI makes concurrent emulator versions costly and difficult to operate; once a device farm is available, run the suite across a supported Android-version and device matrix. |

## Assignment Deliverables Status

| Deliverable | Status | Location or action |
| --- | --- | --- |
| Automated Android tests | Available | `test/specs/` |
| Test-plan rationale and next steps | Available | This document and `SUBMISSION.md` |
| Solution description and run instructions | Available | `SUBMISSION.md` |
| Test execution report | Available | `SUBMISSION.md` records a successful full emulator execution: 21 passing tests in 3 minutes 0.5 seconds. |
| Actual time record | Available | `SUBMISSION.md` records 3 hours. |
| AI usage note and representative prompts | Available | `SUBMISSION.md` and `PROMPT_LIBRARY.md` |

## Known Test Quality Risk

The shared scrolling helper in `test/helpers/gestures.ts` uses fixed
`driver.pause` calls after gestures. Several implemented catalogue flows invoke
that helper, so this is a reliability risk against the assignment's requirement
for proper synchronization without arbitrary sleeps. Replace those pauses with
observable post-scroll conditions before treating the suite as fully
deterministic.

## Coverage Rationale

- **P0 protects product access and core value.** Consent prevents entry, content
  availability prevents discovery, and playback prevents consumption. A failure in
  any of these areas blocks the main user journey.
- **P1 protects correctness at state boundaries.** Detail accuracy, back
  navigation, buffering, completion, and state resets are less likely to block all
  users but are high-value regressions in a stateful media experience.
- **P2 increases confidence across representative content and repeated state
  changes.** These tests reduce the risk of assumptions that only hold for a first
  item or a first session.
- **Deterministic Debug Options are the test oracle for controlled failures.**
  They are used to set error, empty, slow, buffering, completion, and reset states
  explicitly rather than relying on environmental timing.

## Traceability Summary

| Requirement group | Automated priority |
| --- | --- |
| CON-01 to CON-05 | P0 |
| HOME-01 to HOME-06 | P0; expanded catalogue repetition in P2 |
| DET-01 to DET-04 | P1 |
| PLAY-01 to PLAY-04 | P0 |
| PLAY-05 to PLAY-07 | P1 |
| Debug Options and reset controls | P1 |

## Test Independence and Evidence

Each test starts from a known application state and explicitly configures its
required content or playback response. State resets are themselves covered by
automation. Results are determined from visible user-facing outcomes rather than
arbitrary wait times.

Catalogue and player flows select a random card from the deterministic catalogue
and scroll it into view before interacting with it. A flow that leaves and
returns to Details must retain the selected card and reopen that same card.
Amsterdam remains the exception only for its exact metadata and required
reference-detail scenarios. The test data includes each card's stable ID, title,
tag, and duration; in a production system, it would be retrieved from the
backend rather than maintained locally.

On failure, retain the visible application state and execution logs as evidence.

## CI/CD Execution and Reporting

The manually triggered GitHub Actions workflow, **Android E2E Tests**, provides
repeatable CI execution without requiring a local Android environment. From the
repository's **Actions** tab, select the workflow, click **Run workflow**, choose
the branch to validate, and click **Run workflow** again.

The workflow provisions an Android 16 Google APIs Pixel 7 Pro emulator with
KVM acceleration, installs the locked project dependencies, and runs the full
Android E2E suite. It publishes merged JUnit results in the workflow run,
retains the Appium log as an artifact, generates an Allure HTML report, and
deploys it to GitHub Pages. The latest published report is available at
[https://ricardorlg.github.io/dpg-interview/](https://ricardorlg.github.io/dpg-interview/).

The workflow is intentionally manual (`workflow_dispatch`) so the full emulator
suite is run on demand while the project remains in its current assignment
delivery stage. Concurrency cancellation ensures that a newer run for the same
branch supersedes an in-progress run.

## Entry and Exit Criteria

### Entry Criteria

- The Android emulator and debug APK are available.
- Debug Options can configure each documented content, playback, and reset state.
- The application can be restored to a known initial state.

### Exit Criteria

- All implemented P0 and P1 scenarios execute successfully without an exclusive
  Mocha marker.
- The implementation coverage status is current, and every uncovered scenario
  has a documented next step.
- All requirements in `REQUIREMENTS.md` have traceable automated coverage before
  the plan can be considered complete.
- No unresolved defect prevents consent, catalogue access, navigation, metadata
  display, playback controls, playback recovery, or state reset.
- The only documented coverage exclusion is individual player-frame validation.

## Open Questions

These questions do not remove coverage; they define the final expected outcome for
the associated automated assertions.

| ID | Question | Affected tests |
| --- | --- | --- |
| OQ-01 | What maximum wait time is acceptable for catalogue loading and playback start? | P0-10, P1-05 |
| OQ-02 | Is pull-to-refresh required in addition to the visible refresh action? | P0-09 |
| OQ-03 | What exact state and available actions follow playback completion? | P1-06 |
| OQ-04 | What exact result follows retry after a playback error? | P0-14 |
| OQ-05 | Does consent and playback progress persist across app relaunches or only within navigation? | P0-05, P1-07, P2-04 |

## Execution Order

1. Automate P0 to establish the mandatory journey, error recovery, and critical
   state transitions.
2. Automate P1 to cover metadata, navigation, player boundaries, persistence, and
   Debug Options controls.
3. Automate P2 to extend coverage across the full catalogue and repeated state
   changes.
4. Resolve the open questions and update expected outcomes without changing the
   risk-based coverage decision.
