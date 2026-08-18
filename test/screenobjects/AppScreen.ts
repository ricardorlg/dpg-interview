export default class AppScreen {
  private selector: string;

  constructor(selector: string) {
    this.selector = selector;
  }

  async navigateTo(): Promise<void> {}

  /**
   * Wait for the screen to be visible
   *
   * @param {boolean} isShown
   */
  async waitForIsShown(isShown: boolean = true): Promise<boolean | void> {
    return $(this.selector).waitForDisplayed({
      reverse: !isShown,
    });
  }
}
