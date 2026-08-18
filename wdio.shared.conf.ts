export const config: WebdriverIO.Config = {
  tsConfigPath: "./tsconfig.json",
  specs: [["../specs/*.spec.e2e.ts"]],
  exclude: ["../specs/base.spec.e2e.ts"],
  capabilities: [],
  logLevel: "silent",
  bail: 0,
  baseUrl: "http://localhost",
  waitforTimeout: 10_000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  framework: "mocha",
  reporters: [
    [
      "spec",
      {
        showPreface: false,
        onlyFailures: false,
        realtimeReporting: true,
      },
    ],
    [
      "allure",
      {
        outputDir: "allure-results",
        addConsoleLogs: true,
      },
    ],
  ],
  mochaOpts: {
    retries: 1,
    ui: "bdd",
    timeout: 60_000,
  },

  //
  // =====
  // Hooks
  // =====
  /**
   * Gets executed before test execution begins. At this point you can access to all global
   * variables like `browser`. It is the perfect place to define custom commands.
   */
  async before() {
    driver.addCommand("resetAndroidApp", async function () {
      await driver.execute("mobile:terminateApp", {
        appId: ANDROID_PACKAGE,
        timeout: 0,
      });
      await driver.execute("mobile:clearApp", { appId: ANDROID_PACKAGE });
      await driver.execute("mobile:changePermissions", {
        permissions: "all",
        appPackage: ANDROID_PACKAGE,
      });
      await driver.execute("mobile:activateApp", { appId: ANDROID_PACKAGE });
      return await waitForAppToBeLaunched(ANDROID_PACKAGE);
    });
  },

  afterTest: async function (_test, _context, result) {
    if (!result.passed) {
      await driver.takeScreenshot();
    }
    await driver.resetAndroidApp();
  },
};
export const ANDROID_PACKAGE = "com.videoqa.challenge";

export const waitForAppToBeLaunched = async (appId: string) => {
  try {
    await driver.waitUntil(
      async () => {
        const state = await driver.queryAppState(appId);
        return state === 4;
      },
      {
        timeout: 40_000,
        timeoutMsg: "The app didn't start after 40 seconds",
      },
    );
    return { success: true, errorMessage: "" };
  } catch (error) {
    return { success: false, errorMessage: error.message };
  }
};
