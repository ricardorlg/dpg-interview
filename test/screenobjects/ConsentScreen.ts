import AppScreen from "./AppScreen.ts";
import preferencesScreen from "./PreferencesScreen.ts";

class ConsentScreen extends AppScreen {
  constructor() {
    super("id=consent_accept_button");
  }

  private get heading() {
    return $('android=new UiSelector().text("Your privacy choices")');
  }

  get acceptAllButton() {
    return $("id=consent_accept_button");
  }

  get rejectOptionalButton() {
    return $("id=consent_reject_button");
  }

  private get managePreferencesButton() {
    return $("id=consent_manage_preferences_button");
  }

  async acceptAll(): Promise<void> {
    await this.acceptAllButton.click();
  }

  async rejectOptional(): Promise<void> {
    await this.rejectOptionalButton.click();
  }

  async openManagePreferences(): Promise<void> {
    await this.managePreferencesButton.click();
    await preferencesScreen.waitForIsShown();
  }

  async checkPageContent(): Promise<void> {
    await expect(this.heading).toBeDisplayed();
    await expect(this.acceptAllButton).toBeDisplayed();
    await expect(this.rejectOptionalButton).toBeDisplayed();
    await expect(this.managePreferencesButton).toBeDisplayed();
  }
}

export default new ConsentScreen();
