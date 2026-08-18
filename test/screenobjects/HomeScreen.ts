import AppScreen from "./AppScreen.ts";
import {
  ScrollDirection,
  scrollUntilElementIsVisible,
} from "../helpers/gestures.ts";
import { VideoCardData } from "../helpers/videoCards.ts";
import HomeVideoCard from "./components/HomeVideoCard.ts";
import consentScreen from "./ConsentScreen.ts";
import debugOptionsScreen, {
  ContentDebugMode,
  VideoDebugMode,
} from "./DebugOptionsScreen.ts";

class HomeScreen extends AppScreen {
  constructor() {
    super("id=content_overview_screen");
  }

  get contentOverview() {
    return $("id=content_overview_screen");
  }

  get contentList() {
    return $("id=content_list");
  }

  get refreshButton() {
    return $("id=content_refresh_button");
  }

  get debugOptionsButton() {
    return $("id=debug_options_button");
  }

  get emptyRetryButton() {
    return $("id=content_empty_retry_button");
  }

  get errorMessage() {
    return $("id=content_error_message");
  }

  get errorRetryButton() {
    return $("id=content_error_retry_button");
  }

  get loadingIndicator() {
    return $("id=content_loading_indicator");
  }

  get emptyMessage() {
    return $('android=new UiSelector().text("No videos are available")');
  }

  private get videoCards() {
    return $$('android=new UiSelector().resourceIdMatches("content_item_.*")');
  }

  override async navigateTo(): Promise<void> {
    await consentScreen.waitForIsShown();
    await consentScreen.acceptAll();
    await this.waitForIsShown();
  }

  getVideoCard(data: VideoCardData): HomeVideoCard {
    return new HomeVideoCard(data);
  }

  async scrollToVideoCard(card: HomeVideoCard): Promise<void> {
    await this.waitForVideoCards();
    await scrollUntilElementIsVisible(ScrollDirection.UP, card.root);
  }

  async waitForVideoCards(): Promise<void> {
    await this.contentList.waitForDisplayed();
    await expect(this.videoCards).toBeElementsArrayOfSize({
      gte: 1,
      message: "The catalogue did not load any video cards",
    });
  }

  async openVideoDetails(data: VideoCardData): Promise<void> {
    const card = this.getVideoCard(data);
    await this.scrollToVideoCard(card);
    await card.root.click();
  }

  async openDebugOptions(): Promise<void> {
    await this.debugOptionsButton.click();
  }

  async setDebugOption(option: ContentDebugMode): Promise<void> {
    await this.openDebugOptions();
    await debugOptionsScreen.waitForIsShown();
    await debugOptionsScreen.selectContentResponse(option);
    await debugOptionsScreen.save();
  }

  async setVideoResponse(debugMode: VideoDebugMode): Promise<void> {
    await this.openDebugOptions();
    await debugOptionsScreen.waitForIsShown();
    await debugOptionsScreen.selectVideoResponse(debugMode);
    await debugOptionsScreen.save();
  }

  async clearPlaybackProgress(): Promise<void> {
    await this.openDebugOptions();
    await debugOptionsScreen.waitForIsShown();
    await debugOptionsScreen.clearPlaybackProgress();
    await debugOptionsScreen.save();
  }

  async refresh(): Promise<void> {
    await this.refreshButton.click();
  }

  async checkToolbarContent(): Promise<void> {
    await expect(this.contentOverview).toBeDisplayed();
    await expect(this.refreshButton).toBeDisplayed();
    await expect(this.debugOptionsButton).toBeDisplayed();
  }
}

export default new HomeScreen();
