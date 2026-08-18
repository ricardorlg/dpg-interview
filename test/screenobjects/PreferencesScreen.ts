import AppScreen from "./AppScreen.ts";

class PreferencesScreen extends AppScreen {
  constructor() {
    super("id=preferences_save_button");
  }

  get analyticsToggle() {
    return $("id=analytics_toggle");
  }

  get personalisedContentToggle() {
    return $("id=personalisation_toggle");
  }

  get saveButton() {
    return $("id=preferences_save_button");
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async checkPageContent(): Promise<void> {
    await expect(this.analyticsToggle).toBeDisplayed();
    await expect(this.personalisedContentToggle).toBeDisplayed();
  }

  //TODO: Update to check the state of the toggle before clicking it, to avoid unnecessary clicks
  async enableAnalytics(): Promise<void> {
    await this.analyticsToggle.click();
    await this.save();
  }
}

export default new PreferencesScreen();
