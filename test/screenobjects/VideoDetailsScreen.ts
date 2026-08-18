import { getAmsterdamVideo, VideoCardData } from "../helpers/videoCards.ts";
import AppScreen from "./AppScreen.ts";
import homeScreen from "./HomeScreen.ts";
import { VideoDebugMode } from "./DebugOptionsScreen.ts";
import VideoPlayer from "./components/VideoPlayer.ts";

class VideoDetailsScreen extends AppScreen {
  constructor() {
    super("id=detail_title");
  }

  get title() {
    return $("id=detail_title");
  }

  get category() {
    return $("id=detail_category");
  }

  get description() {
    return $("id=detail_description");
  }

  get metadata() {
    const video = getAmsterdamVideo();
    const publicationDatePattern = video.publicationDate.replaceAll(
      " ",
      "\\s+",
    );
    return $(
      `android=new UiSelector().textMatches(".*Published\\s+${publicationDatePattern}\\s+.*\\s+${video.duration}.*")`,
    );
  }

  get playerSurface() {
    return $("id=video_play_button");
  }

  get player() {
    return new VideoPlayer();
  }

  get backButton() {
    return $("id=detail_back_button");
  }

  override async navigateTo(
    debugMode?: VideoDebugMode,
    video?: VideoCardData,
  ): Promise<void> {
    await homeScreen.navigateTo();
    if (debugMode) {
      await homeScreen.setVideoResponse(debugMode);
    }
    if (video) {
      await this.openVideoFromHome(video);
    }
  }

  async openVideoFromHome(video: VideoCardData): Promise<void> {
    await homeScreen.openVideoDetails(video);
    await this.waitForIsShown();
  }

  async returnToHome(): Promise<void> {
    await this.backButton.click();
    await homeScreen.waitForIsShown();
  }
}

export default new VideoDetailsScreen();
