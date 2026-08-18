import { getAmsterdamVideo } from "../helpers/videoCards.ts";
import homeScreen from "../screenobjects/HomeScreen.ts";
import videoDetailsScreen from "../screenobjects/VideoDetailsScreen.ts";

describe("Video details screen", function () {
  /**
   * Scenarios: P1-01, P1-02 - A selected video opens its detail page in preview mode.
   * Requirement: HOME-03, DET-01, DET-02
   */
  it("identifies the selected video in preview mode and provides a Back action", async function () {
    const video = getAmsterdamVideo();
    await videoDetailsScreen.navigateTo(undefined, video);
    const videoPlayer = videoDetailsScreen.player;

    await expect(videoDetailsScreen.title).toHaveText(video.title);
    await expect(videoPlayer.previewLabel).toBeDisplayed();
    await expect(videoPlayer.playButton).toBeDisplayed();
    await expect(videoPlayer.pauseButton).not.toExist();
    await expect(videoDetailsScreen.backButton).toBeDisplayed();
  });

  /**
   * Scenario: P1-03 - Amsterdam metadata matches its catalogue entry.
   * Requirement: DET-03, DET-04
   */
  it("shows the selected video's complete metadata", async function () {
    const video = getAmsterdamVideo();
    await videoDetailsScreen.navigateTo(undefined, video);

    await expect(videoDetailsScreen.title).toHaveText(video.title);
    await expect(videoDetailsScreen.category).toHaveText(video.tag);
    await expect(videoDetailsScreen.description).toHaveText(video.description);
    await expect(videoDetailsScreen.metadata).toBeDisplayed();
  });

  /**
   * Scenario: P1-04 - Back returns the user to the catalogue.
   * Requirement: DET-01
   */
  it("returns to the catalogue when Back is selected", async function () {
    const video = getAmsterdamVideo();
    await videoDetailsScreen.navigateTo(undefined, video);

    await videoDetailsScreen.returnToHome();

    await expect(homeScreen.contentOverview).toBeDisplayed();
    await expect(videoDetailsScreen.title).not.toExist();
  });
});
