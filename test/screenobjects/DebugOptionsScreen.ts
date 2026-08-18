import AppScreen from "./AppScreen.ts";

export enum ContentDebugMode {
  SUCCESS = "id=debug_content_success",
  EMPTY = "id=debug_content_empty",
  SERVER_ERROR = "id=debug_content_error",
  SLOW_RESPONSE = "id=debug_content_slow",
}

export enum VideoDebugMode {
  NORMAL_PLAYBACK = "id=debug_video_normal",
  LONG_BUFFERING = "id=debug_video_buffering",
  PLAYBACK_ERROR = "id=debug_video_error",
  PLAYBACK_COMPLETES_QUICKLY = "id=debug_video_complete_quickly",
}

class DebugOptionsScreen extends AppScreen {
  constructor() {
    super("id=debug_done_button");
  }

  get doneButton() {
    return $("id=debug_done_button");
  }

  async selectContentResponse(response: ContentDebugMode): Promise<void> {
    await $(response).click();
  }

  async selectVideoResponse(debugMode: VideoDebugMode): Promise<void> {
    await $(debugMode).click();
  }

  async clearPlaybackProgress(): Promise<void> {
    await $("id=debug_clear_progress").click();
  }

  async save(): Promise<void> {
    await this.doneButton.click();
  }
}

export default new DebugOptionsScreen();
