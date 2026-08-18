import { ContentDebugMode } from "../screenobjects/DebugOptionsScreen.ts";
import homeScreen from "../screenobjects/HomeScreen.ts";
import { getRandomVideoCard } from "../helpers/videoCards.ts";

describe("Home screen", function () {
  /**
   * Scenario: P0-06 - Successful content is available after consent.
   * Requirement: HOME-01, HOME-02
   */
  it("shows catalogue controls and selected video metadata after consent is resolved", async function () {
    await homeScreen.navigateTo();
    const selectedVideoData = getRandomVideoCard();
    const selectedVideo = homeScreen.getVideoCard(selectedVideoData);
    await homeScreen.scrollToVideoCard(selectedVideo);
    await homeScreen.checkToolbarContent();
    await selectedVideo.checkContent();
  });

  /**
   * Scenario: P0-07 - Empty content has no stale video cards.
   * Requirement: HOME-04
   */
  it("shows a retryable empty state without catalogue cards", async function () {
    await homeScreen.navigateTo();
    const selectedVideo = homeScreen.getVideoCard(getRandomVideoCard());
    await homeScreen.setDebugOption(ContentDebugMode.EMPTY);

    await expect(homeScreen.emptyMessage).toBeDisplayed();
    await expect(homeScreen.emptyRetryButton).toBeDisplayed();
    await expect(selectedVideo.root).not.toExist();
  });

  /**
   * Scenario: P0-08 - A server content failure is distinguishable from empty content.
   * Requirement: HOME-05
   */
  it("shows a retryable server error without catalogue cards", async function () {
    await homeScreen.navigateTo();
    const selectedVideo = homeScreen.getVideoCard(getRandomVideoCard());
    await homeScreen.setDebugOption(ContentDebugMode.SERVER_ERROR);

    await expect(homeScreen.errorMessage).toHaveText(
      "We could not load the videos",
    );
    await expect(homeScreen.errorRetryButton).toBeDisplayed();
    await expect(homeScreen.emptyRetryButton).not.toExist();
    await expect(selectedVideo.root).not.toExist();
  });

  /**
   * Scenario: P0-09 - Content recovers after the configured error is removed.
   * Requirement: HOME-05
   */
  it("restores the catalogue after a server error is changed to success", async function () {
    await homeScreen.navigateTo();
    const selectedVideo = homeScreen.getVideoCard(getRandomVideoCard());
    await homeScreen.setDebugOption(ContentDebugMode.SERVER_ERROR);
    await expect(homeScreen.errorMessage).toBeDisplayed();

    await homeScreen.setDebugOption(ContentDebugMode.SUCCESS);
    await homeScreen.refresh();
    await homeScreen.scrollToVideoCard(selectedVideo);

    await expect(selectedVideo.root).toBeDisplayed();
    await expect(homeScreen.errorMessage).not.toExist();
  });

  /**
   * Scenario: P0-10 - Slow content represents loading before it becomes available.
   * Requirement: HOME-06
   */
  it("shows loading instead of an error while a slow catalogue response is pending", async function () {
    await homeScreen.navigateTo();
    const selectedVideo = homeScreen.getVideoCard(getRandomVideoCard());
    await homeScreen.setDebugOption(ContentDebugMode.SLOW_RESPONSE);

    await expect(homeScreen.loadingIndicator).toBeDisplayed();
    await expect(homeScreen.errorMessage).not.toExist();
    await expect(selectedVideo.root).not.toExist();
    await homeScreen.scrollToVideoCard(selectedVideo);
    await expect(selectedVideo.root).toBeDisplayed();
  });
});
