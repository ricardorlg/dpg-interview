import { VideoCardData } from "../../helpers/videoCards.ts";
import {
  ScrollDirection,
  scrollUntilElementIsVisible,
} from "../../helpers/gestures.ts";

export default class HomeVideoCard {
  constructor(private readonly data: VideoCardData) {}

  get root() {
    return $(`id=${this.data.id}`);
  }

  get title() {
    return $(`id=${this.data.id.replace("content_item_", "content_title_")}`);
  }

  get tag() {
    return $(`android=new UiSelector().text("${this.data.tag}")`);
  }

  get duration() {
    return $(`android=new UiSelector().text("${this.data.duration}")`);
  }

  async checkContent(): Promise<void> {
    await expect(this.root).toBeDisplayed();

    await scrollUntilElementIsVisible(
      ScrollDirection.UP,
      this.title,
      5,
      (locator) =>
        `Video card title ${locator} was not found after scrolling 5 times`,
    );
    await expect(this.title).toHaveText(this.data.title);

    await scrollUntilElementIsVisible(
      ScrollDirection.UP,
      this.tag,
      5,
      (locator) =>
        `Video card category ${locator} was not found after scrolling 5 times`,
    );
    await expect(this.tag).toBeDisplayed();

    await scrollUntilElementIsVisible(
      ScrollDirection.UP,
      this.duration,
      5,
      (locator) =>
        `Video card duration ${locator} was not found after scrolling 5 times`,
    );
    await expect(this.duration).toBeDisplayed();
  }
}
