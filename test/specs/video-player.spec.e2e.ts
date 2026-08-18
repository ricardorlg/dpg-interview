import { VideoDebugMode } from "../screenobjects/DebugOptionsScreen.ts";
import homeScreen from "../screenobjects/HomeScreen.ts";
import videoDetailsScreen from "../screenobjects/VideoDetailsScreen.ts";
import { VideoPlayerState } from "../screenobjects/components/VideoPlayer.ts";
import { getRandomVideoCard } from "../helpers/videoCards.ts";

describe("Video player", function () {
  /**
   * Scenario: P0-11 - Playback starts after the user selects Play.
   * Requirement: PLAY-01, PLAY-03
   */
  it("plays the selected video and advances its visible progress", async function () {
    const video = getRandomVideoCard();
    await videoDetailsScreen.navigateTo(undefined, video);
    const videoPlayer = videoDetailsScreen.player;
    await videoPlayer.play();
    await videoPlayer.waitForState(VideoPlayerState.PLAYING);
    await videoPlayer.waitForProgressToAdvance();

    await expect(videoPlayer.pauseButton).toBeDisplayed();
    await expect(videoPlayer.currentPosition).not.toHaveText("00:00");
    await expect(videoPlayer.progress).not.toHaveText("0.0");
    await expect(videoPlayer.duration).toHaveText("00:30");
  });

  /**
   * Scenario: P0-12 - Playback can be paused and resumed.
   * Requirement: PLAY-02
   */
  it("changes between Playing and Paused when the playback control is selected", async function () {
    const video = getRandomVideoCard();
    await videoDetailsScreen.navigateTo(undefined, video);
    const videoPlayer = videoDetailsScreen.player;
    await videoPlayer.play();
    await videoPlayer.waitForState(VideoPlayerState.PLAYING);

    await videoPlayer.pause();
    await videoPlayer.waitForState(VideoPlayerState.PAUSED);
    await expect(videoPlayer.playButton).toBeDisplayed();

    await videoPlayer.play();
    await videoPlayer.waitForState(VideoPlayerState.PLAYING);
    await expect(videoPlayer.pauseButton).toBeDisplayed();
  });

  /**
   * Scenario: P0-13 - A configured playback failure is visible and retryable.
   * Requirement: PLAY-04
   */
  it("shows an error and retry action without reporting successful progress", async function () {
    const video = getRandomVideoCard();
    await videoDetailsScreen.navigateTo(VideoDebugMode.PLAYBACK_ERROR, video);
    const videoPlayer = videoDetailsScreen.player;
    await videoPlayer.play();
    await videoPlayer.waitForState(VideoPlayerState.ERROR);

    await expect(videoPlayer.errorMessage).toHaveText(
      "Video could not be played",
    );
    await expect(videoPlayer.retryButton).toBeDisplayed();
    await expect(videoPlayer.currentPosition).toHaveText("00:00");
    await expect(videoPlayer.progress).toHaveText("0.0");
  });

  /**
   * Scenario: P0-14 - Retry repeats the configured playback outcome.
   * Requirement: PLAY-04
   */
  it("keeps the error visible when retrying while playback failure remains configured", async function () {
    const video = getRandomVideoCard();
    await videoDetailsScreen.navigateTo(VideoDebugMode.PLAYBACK_ERROR, video);
    const videoPlayer = videoDetailsScreen.player;
    await videoPlayer.play();
    await videoPlayer.waitForState(VideoPlayerState.ERROR);

    await videoPlayer.retry();
    await videoPlayer.waitForState(VideoPlayerState.ERROR);

    await expect(videoPlayer.errorMessage).toBeDisplayed();
    await expect(videoPlayer.progress).toHaveText("0.0");
  });

  /**
   * Scenario: P1-05 - Buffering is represented before playback begins.
   * Requirement: PLAY-05
   */
  it("shows buffering instead of a false Playing state while playback is pending", async function () {
    const video = getRandomVideoCard();
    await videoDetailsScreen.navigateTo(VideoDebugMode.LONG_BUFFERING, video);
    const videoPlayer = videoDetailsScreen.player;
    await videoPlayer.play();
    await videoPlayer.waitForState(VideoPlayerState.BUFFERING);

    await expect(videoPlayer.bufferingIndicator).toBeDisplayed();
    await expect(videoPlayer.playButton).toBeDisabled();
    await expect(videoPlayer.currentPosition).toHaveText("00:00");
  });

  /**
   * Scenario: P1-06 - Fast playback reaches a terminal state.
   * Requirement: PLAY-06
   */
  it("shows Completed after the configured fast playback finishes", async function () {
    const video = getRandomVideoCard();
    await videoDetailsScreen.navigateTo(
      VideoDebugMode.PLAYBACK_COMPLETES_QUICKLY,
      video,
    );
    const videoPlayer = videoDetailsScreen.player;
    await videoPlayer.play();
    await videoPlayer.waitForState(VideoPlayerState.COMPLETED);

    await expect(videoPlayer.playButton).toBeDisplayed();
    await expect(videoPlayer.currentPosition).toHaveText("00:30");
    await expect(videoPlayer.progress).toHaveText("1.0");
  });

  /**
   * Scenario: P1-07 - Progress is retained when returning to a video.
   * Requirement: PLAY-07
   */
  it("resumes from retained progress when returning to a video", async function () {
    const video = getRandomVideoCard();
    await videoDetailsScreen.navigateTo(undefined, video);
    const videoPlayer = videoDetailsScreen.player;
    await videoPlayer.play();
    const savedPosition = await videoPlayer.waitForPositionAtLeast(5);
    await videoDetailsScreen.returnToHome();

    await videoDetailsScreen.openVideoFromHome(video);
    const newVideoPlayer = videoDetailsScreen.player;
    await newVideoPlayer.play();
    await newVideoPlayer.currentPosition.waitForDisplayed();

    await driver.waitUntil(
      async () =>
        (await newVideoPlayer.getPositionInSeconds()) >= savedPosition,
      {
        timeout: 4_000,
        interval: 250,
        timeoutMsg: "The player did not restore its retained playback position",
      },
    );
  });

  /**
   * Scenario: P1-08 - Clearing playback progress returns the video to its start.
   * Requirement: PLAY-07
   */
  it("starts from the initial position after saved playback progress is cleared", async function () {
    const video = getRandomVideoCard();
    await videoDetailsScreen.navigateTo(undefined, video);
    const videoPlayer = videoDetailsScreen.player;
    await videoPlayer.play();
    await videoPlayer.waitForProgressToAdvance();
    await videoDetailsScreen.returnToHome();

    await homeScreen.clearPlaybackProgress();
    await videoDetailsScreen.openVideoFromHome(video);
    const newVideoPlayer = videoDetailsScreen.player;
    await newVideoPlayer.play();
    await newVideoPlayer.currentPosition.waitForDisplayed();

    await expect(newVideoPlayer.currentPosition).toHaveText("00:00");
    await expect(newVideoPlayer.progress).toHaveText("0.0");
  });
});
