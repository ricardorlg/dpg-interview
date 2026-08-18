import { config as baseConfig } from "../../wdio.shared.conf.ts";
import { configDotenv } from "dotenv";
import * as path from "path";
import { RequestedStandaloneCapabilities } from "@wdio/types/build/Capabilities";
import { join } from "node:path";

configDotenv({ path: path.resolve(process.cwd(), ".env.local"), quiet: true });

const localAndroidCapabilities: RequestedStandaloneCapabilities[] = [
  {
    platformName: "Android",
    "appium:deviceName":
      process.env.ANDROID_DEVICE_NAME?.toString() ?? "emulator-5554",
    "appium:udid":
      process.env.ANDROID_DEVICE_NAME?.toString() ?? "emulator-5554",
    "appium:automationName": "UIAutomator2",
    "appium:app": join(process.cwd(), "apps", "VideoQAChallenge-debug.apk"),
    "appium:newCommandTimeout": 0,
    // @ts-expect-error unknown option in wdio
    "appium:disableIdLocatorAutocompletion": true,
    "appium:hideKeyboard": true,
    "appium:allowInvisibleElements": true,
    "appium:autoGrantPermissions": true,
    "appium:enableMultiWindows": true,
  },
];

export const config: WebdriverIO.Config = {
  ...baseConfig,
  capabilities: localAndroidCapabilities,
  baseUrl: "127.0.0.1",
  port: 4723,
};
