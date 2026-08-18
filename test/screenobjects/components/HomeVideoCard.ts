import { VideoCardData } from "../../helpers/videoCards.ts";

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
    await expect(this.title).toHaveText(this.data.title);
    await expect(this.tag).toBeDisplayed();
    await expect(this.duration).toBeDisplayed();
  }
}
