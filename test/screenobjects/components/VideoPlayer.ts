export enum VideoPlayerState {
  BUFFERING = "Buffering",
  PLAYING = "Playing",
  PAUSED = "Paused",
  ERROR = "Error",
  COMPLETED = "Completed",
}

export default class VideoPlayer {
  get previewLabel() {
    return $('android=new UiSelector().text("Video preview")');
  }

  get playButton() {
    return $("id=video_play_button");
  }

  get pauseButton() {
    return $("id=video_pause_button");
  }

  get currentPosition() {
    return $("id=video_current_position");
  }

  get progress() {
    return $("id=video_progress");
  }

  get duration() {
    return $("id=video_duration");
  }

  get stateLabel() {
    return $("id=video_state_label");
  }

  get bufferingIndicator() {
    return $("id=video_buffering_indicator");
  }

  get errorMessage() {
    return $("id=video_error_message");
  }

  get retryButton() {
    return $("id=video_retry_button");
  }

  async play(): Promise<void> {
    await this.playButton.click();
  }

  async pause(): Promise<void> {
    await this.pauseButton.click();
  }

  async retry(): Promise<void> {
    await this.retryButton.click();
  }

  async waitForState(state: VideoPlayerState): Promise<void> {
    await browser.waitUntil(
      async () => (await this.stateLabel.getText()) === state,
      {
        timeout: 10_000,
        interval: 250,
        timeoutMsg: `The player did not reach the ${state} state`,
      },
    );
  }

  async waitForProgressToAdvance(): Promise<void> {
    const initialPosition = await this.currentPosition.getText();
    await browser.waitUntil(
      async () => {
        const currentPosition = await this.currentPosition.getText();
        return (
          currentPosition !== initialPosition && currentPosition !== "00:00"
        );
      },
      {
        timeout: 10_000,
        interval: 250,
        timeoutMsg: "The player position did not advance",
      },
    );
  }

  async waitForPositionAtLeast(seconds: number): Promise<number> {
    let currentSeconds = 0;
    await browser.waitUntil(
      async () => {
        currentSeconds = this.positionToSeconds(
          await this.currentPosition.getText(),
        );
        return currentSeconds >= seconds;
      },
      {
        timeout: 10_000,
        interval: 250,
        timeoutMsg: `The player did not reach ${seconds} seconds`,
      },
    );
    return currentSeconds;
  }

  async getPositionInSeconds(): Promise<number> {
    return this.positionToSeconds(await this.currentPosition.getText());
  }

  private positionToSeconds(position: string): number {
    const [minutes, seconds] = position.split(":").map(Number);
    return minutes * 60 + seconds;
  }
}
