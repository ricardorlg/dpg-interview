declare namespace WebdriverIO {
  interface Browser {
    resetAndroidApp: () => Promise<{ success: boolean; errorMessage: string }>;
  }
}
