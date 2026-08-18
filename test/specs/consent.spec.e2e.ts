import { ANDROID_PACKAGE } from "../../wdio.shared.conf.ts";
import consentScreen from "../screenobjects/ConsentScreen.ts";
import homeScreen from "../screenobjects/HomeScreen.ts";
import preferencesScreen from "../screenobjects/PreferencesScreen.ts";

describe("Consent screen", function () {
  /**
   * Scenario: P0-01 - First launch requires a privacy decision.
   * Requirement: CON-01, CON-02
   */
  it("shows all privacy choices before the video catalogue", async function () {
    await consentScreen.waitForIsShown();
    await consentScreen.checkPageContent();
    await expect(homeScreen.contentOverview).not.toExist();
  });

  /**
   * Scenario: P0-02 - Accepting all preferences opens the catalogue.
   * Requirement: CON-03
   */
  it("opens the video catalogue after accepting all preferences", async function () {
    await consentScreen.waitForIsShown();
    await consentScreen.acceptAll();
    await homeScreen.waitForIsShown();
    await expect(consentScreen.acceptAllButton).not.toBeDisplayed();
  });

  /**
   * Scenario: P0-03 - Rejecting optional preferences opens the catalogue.
   * Requirement: CON-03
   */
  it("opens the video catalogue after rejecting optional preferences", async function () {
    await consentScreen.waitForIsShown();
    await consentScreen.rejectOptional();
    await homeScreen.waitForIsShown();
    await expect(consentScreen.rejectOptionalButton).not.toBeDisplayed();
  });

  /**
   * Scenario: P0-04 - Saving granular preferences opens the catalogue.
   * Requirement: CON-04
   */
  it("allows granular preferences to be saved before opening the video catalogue", async function () {
    await consentScreen.waitForIsShown();
    await consentScreen.openManagePreferences();
    await preferencesScreen.checkPageContent();
    await preferencesScreen.enableAnalytics();
    await homeScreen.waitForIsShown();
    await expect(consentScreen.acceptAllButton).not.toBeDisplayed();
  });

  /**
   * Scenario: P0-05 - A consent decision persists after the app relaunches.
   * Requirement: CON-05
   */
  it("does not show consent again after accepting preferences and relaunching", async function () {
    await consentScreen.waitForIsShown();
    await consentScreen.acceptAll();
    await homeScreen.waitForIsShown();
    await driver.terminateApp(ANDROID_PACKAGE);
    await driver.activateApp(ANDROID_PACKAGE);
    await homeScreen.waitForIsShown();
    await expect(consentScreen.acceptAllButton).not.toBeDisplayed();
  });
});
