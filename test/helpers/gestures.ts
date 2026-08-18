import { AssertionError } from "assertion-error";

export enum ScrollDirection {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

const swipe = async (
  from: {
    x: number;
    y: number;
  },
  to: {
    x: number;
    y: number;
  },
) => {
  await driver.performActions([
    {
      type: "pointer",
      id: "finger1",
      parameters: { pointerType: "touch" },
      actions: [
        { type: "pointerMove", duration: 0, x: from.x, y: from.y },
        { type: "pointerDown", button: 0 },
        { type: "pause", duration: 100 },
        { type: "pointerMove", duration: 1000, x: to.x, y: to.y },
        { type: "pointerUp", button: 0 },
      ],
    },
  ]);
  await driver.pause(2000);
};

const findElementBySwipe = async ({
  element,
  maxScrolls = 5,
  scrollableElement,
  scrollUp = false,
}: {
  element: WebdriverIO.Element;
  maxScrolls?: number;
  scrollableElement: WebdriverIO.Element;
  scrollUp?: boolean;
}): Promise<WebdriverIO.Element | undefined> => {
  for (let i = 0; i < maxScrolls; i++) {
    if (await element.isDisplayed()) {
      return element;
    }

    const { x, y, height, width } = await driver.getElementRect(
      scrollableElement.elementId,
    );
    const centerX = x + width / 2;
    const yStart = y + height * 0.9;
    const yEnd = y + height * 0.1;
    if (scrollUp) {
      await swipe({ x: centerX, y: yEnd }, { x: centerX, y: yStart });
    } else {
      await swipe({ x: centerX, y: yStart }, { x: centerX, y: yEnd });
    }
  }
};

const scrollOnScreen = async (
  direction: ScrollDirection,
  isFastScroll: boolean = true,
  justABit: boolean = false,
) => {
  const windowSize = await driver.getWindowSize();
  const startX = windowSize.width / 2;
  const startY = windowSize.height / 2;
  const scrollDuration = isFastScroll ? 200 : 400;
  let endX = startX;
  let endY = startY;
  switch (direction) {
    case ScrollDirection.UP:
      endY = isFastScroll ? 0 : justABit ? startY - 100 : startY / 2.0;
      break;
    case ScrollDirection.DOWN:
      endY = isFastScroll
        ? windowSize.height
        : startY + (justABit ? 100 : startY / 2);
      break;
    case ScrollDirection.LEFT:
      endX = isFastScroll ? 0 : justABit ? startX - 100 : startX / 2;
      break;
    case ScrollDirection.RIGHT:
      endX = isFastScroll
        ? windowSize.width
        : startX + (justABit ? 100 : startX / 2);
      break;
  }
  await driver.performActions([
    {
      type: "pointer",
      id: "finger1",
      parameters: { pointerType: "touch" },
      actions: [
        { type: "pointerMove", duration: 0, x: startX, y: startY },
        { type: "pointerDown", button: 0 },
        { type: "pause", duration: 100 }, // Adjust the duration as needed
        { type: "pointerMove", duration: scrollDuration, x: endX, y: endY },
        { type: "pointerUp", button: 0 },
      ],
    },
  ]);
  await driver.releaseActions();
};

const tapOnElement = async (
  element: WebdriverIO.Element | ChainablePromiseElement,
) => {
  return await tapElementAt(element, 0.5, 0.5);
};

const tapAtPoint = async (x: number, y: number, pause: number = 100) => {
  await driver.performActions([
    {
      type: "pointer",
      id: "finger1",
      parameters: { pointerType: "touch" },
      actions: [
        { type: "pointerMove", duration: 0, x, y },
        { type: "pointerDown", button: 0 },
        { type: "pause", duration: pause },
        { type: "pointerUp", button: 0 },
      ],
    },
  ]);
};

const tapElementAt = async (
  elementLocator: WebdriverIO.Element | ChainablePromiseElement,
  xPct: number,
  yPct: number,
) => {
  let element: WebdriverIO.Element;
  if (
    "getElement" in elementLocator &&
    typeof elementLocator.getElement === "function"
  ) {
    element = await elementLocator.getElement();
  } else {
    element = elementLocator as WebdriverIO.Element;
  }
  const elementLocation = await element.getLocation();
  const elementSize = await element.getSize();
  const pointX = elementLocation.x + elementSize.width * xPct;
  const pointY = elementLocation.y + elementSize.height * yPct;
  return await tapAtPoint(pointX, pointY);
};

const tapOutsideOfElementAt = async (
  elementLocator: WebdriverIO.Element | ChainablePromiseElement,
  direction: ScrollDirection,
) => {
  let element: WebdriverIO.Element;
  if (
    "getElement" in elementLocator &&
    typeof elementLocator.getElement === "function"
  ) {
    element = await elementLocator.getElement();
  } else {
    element = elementLocator as WebdriverIO.Element;
  }
  const elementLocation = await element.getLocation();
  const elementSize = await element.getSize();
  let xPoint: number;
  let yPoint: number;
  switch (direction) {
    case ScrollDirection.UP:
      xPoint = elementLocation.x + elementSize.width / 2;
      yPoint = elementLocation.y - 50;
      break;
    case ScrollDirection.DOWN:
      xPoint = elementLocation.x + elementSize.width / 2;
      yPoint = elementLocation.y + elementSize.height + 50;
      break;
    case ScrollDirection.LEFT:
      xPoint = elementLocation.x - 50;
      yPoint = elementLocation.y + elementSize.height / 2;
      break;
    case ScrollDirection.RIGHT:
      xPoint = elementLocation.x + elementSize.width + 50;
      yPoint = elementLocation.y + elementSize.height / 2;
      break;
  }
  return await tapAtPoint(xPoint, yPoint);
};

const scrollUntilElementIsVisible = async (
  direction: ScrollDirection,
  elementSelector: ChainablePromiseElement | string,
  maxScrollAttempts: number = 20,
  errorMessageSupplier?: (locator: string) => string,
) => {
  return await scrollUntilElementHasState(
    direction,
    elementSelector,
    (element) => element.then((el) => el.isDisplayed()),
    maxScrollAttempts,
    errorMessageSupplier ||
      ((locator) =>
        `Element ${locator} was not visible after scrolling ${maxScrollAttempts} times`),
  );
};

const scrollUntilElementIsPresent = async (
  direction: ScrollDirection,
  elementSelector: ChainablePromiseElement | string,
  maxScrollAttempts: number = 20,
  errorMessageSupplier?: (locator: string) => string,
) => {
  return await scrollUntilElementHasState(
    direction,
    elementSelector,
    (element) => element.then((el) => el.isExisting()),
    maxScrollAttempts,
    errorMessageSupplier ||
      ((locator) =>
        `Element ${locator} was not present after scrolling ${maxScrollAttempts} times`),
  );
};

const scrollUntilElementIsNotVisible = async (
  direction: ScrollDirection,
  elementSelector: ChainablePromiseElement | string,
  maxScrollAttempts: number = 20,
  errorMessageSupplier?: (locator: string) => string,
) => {
  return await scrollUntilElementHasState(
    direction,
    elementSelector,
    (element) =>
      element
        .then((el) => el.isDisplayed())
        .then((isDisplayed) => !isDisplayed),
    maxScrollAttempts,
    errorMessageSupplier ||
      ((locator) =>
        `Element ${locator} was still visible after scrolling ${maxScrollAttempts} times`),
  );
};

const scrollOnList = async (
  listContainerElement: ChainablePromiseElement | WebdriverIO.Element,
  direction: ScrollDirection,
  isFastScroll = true,
  heightPercentageToStart = 0.5,
  widthPercentageToStart = 0.5,
) => {
  const element = await listContainerElement.getElement();
  const elementLocation = await element.getLocation();
  const elementSize = await element.getSize();
  const startX = elementLocation.x + elementSize.width * widthPercentageToStart;
  const startY =
    elementLocation.y + elementSize.height * heightPercentageToStart;
  const scrollDuration = isFastScroll ? 200 : 800;
  let endX = startX;
  let endY = startY;
  switch (direction) {
    case ScrollDirection.UP:
      endY = isFastScroll ? elementLocation.y : startY / 2;
      break;
    case ScrollDirection.DOWN:
      endY = isFastScroll
        ? elementLocation.y + elementSize.height
        : startY + startY / 2;
      break;
    case ScrollDirection.LEFT:
      endX = isFastScroll ? elementLocation.x : startX / 2;
      break;
    case ScrollDirection.RIGHT:
      endX = isFastScroll
        ? elementLocation.x + elementSize.width
        : startX + startX / 2;
      break;
  }

  await driver.performActions([
    {
      type: "pointer",
      id: "finger1",
      parameters: { pointerType: "touch" },
      actions: [
        { type: "pointerMove", duration: 0, x: startX, y: startY },
        { type: "pointerDown", button: 0 },
        { type: "pause", duration: 100 }, // Adjust the duration as needed
        { type: "pointerMove", duration: scrollDuration, x: endX, y: endY },
        { type: "pointerUp", button: 0 },
      ],
    },
  ]);
  await driver.pause(1000);
};

const scrollToElementInList = async (
  listElement: WebdriverIO.Element,
  targetElement: ChainablePromiseElement,
  scrollDirection: ScrollDirection,
  maxTries = 15,
  heightPercentageToStart = 0.5,
  widthPercentageToStart = 0.5,
) => {
  let attempt = 0;
  while (attempt <= maxTries) {
    const isElementVisible: boolean = driver.isIOS
      ? await isElementVisibleInTheScreen(targetElement)
      : await targetElement.isDisplayed();
    if (isElementVisible) {
      return;
    }
    await scrollOnList(
      listElement,
      scrollDirection,
      true,
      heightPercentageToStart,
      widthPercentageToStart,
    );
    attempt++;
  }
  throw new AssertionError(
    `Element ${targetElement.selector} was not found after ${maxTries} tries`,
  );
};

/**
 * Simulates a pull-to-refresh gesture on a mobile application.
 *
 * @param {WebdriverIO.Element} topLevelElement - The top-level element on which the pull-to-refresh gesture will be performed.
 * @param {WebdriverIO.Element} refreshIcon - The element representing the refresh icon that indicates the refresh process.
 * @param {boolean} [skipAsserts=true] - If true, skips the visibility assertions for the refresh icon.
 * @returns {Promise<void>} - A promise that resolves after the pull-to-refresh gesture is simulated.
 *
 * @example
 * // Example usage:
 * await pullToRefresh(topLevelElement, refreshIcon, false);
 */
const pullToRefresh = async (
  topLevelElement: WebdriverIO.Element,
  refreshIcon: WebdriverIO.Element,
  skipAsserts: boolean = true,
): Promise<void> => {
  const { x, y } = await topLevelElement.getLocation();
  const windowSize = await driver.getWindowSize();
  const endY = y + windowSize.height / 2;

  if (!skipAsserts) {
    await expect(refreshIcon).not.toBeDisplayed();
  }

  await driver.performActions([
    {
      type: "pointer",
      id: "finger1",
      parameters: { pointerType: "touch" },
      actions: [
        { type: "pointerMove", duration: 0, x, y },
        { type: "pointerDown", button: 0 },
        { type: "pointerMove", duration: 300, x, y: endY },
        { type: "pause", duration: 1000 },
      ],
    },
  ]);

  if (!skipAsserts) {
    await expect(refreshIcon).toBeDisplayed();
  }

  await driver.performActions([
    {
      type: "pointer",
      id: "finger2",
      parameters: { pointerType: "touch" },
      actions: [
        { type: "pointerMove", duration: 0, x, y: endY },
        { type: "pointerUp", button: 0 },
      ],
    },
  ]);
  if (!skipAsserts) {
    await expect(refreshIcon).not.toBeDisplayed();
  }
};

const scrollUntilElementHasState = async (
  direction: ScrollDirection,
  elementSelector: ChainablePromiseElement | string,
  stateEvaluator: (element: Promise<WebdriverIO.Element>) => Promise<boolean>,
  maxScrollAttempts: number = 20,
  errorMessageSupplier: (locator: string) => string,
) => {
  const elementLocator =
    typeof elementSelector === "string"
      ? elementSelector
      : (await elementSelector.selector).toString();

  for (
    let scrollAttempt = 1;
    scrollAttempt <= maxScrollAttempts;
    scrollAttempt++
  ) {
    try {
      const locator: ChainablePromiseElement =
        typeof elementSelector === "string"
          ? $(elementSelector)
          : elementSelector;

      const elementHasState = await stateEvaluator(locator.getElement());
      if (elementHasState) {
        return scrollAttempt > 1;
      }
    } catch {
      // Do nothing
    }
    await scrollOnScreen(direction, false);
    await driver.pause(500);
  }

  throw new Error(errorMessageSupplier(elementLocator));
};
const getMiddleOfElement = async (element: WebdriverIO.Element) => {
  try {
    const location = await element.getLocation();
    const size = await element.getSize();

    // Calculate midpoint
    return {
      x: location.x + size.width / 2,
      y: location.y + size.height / 2,
    };
  } catch (error) {
    throw new Error(`Error getting the middle of the element: ${error}`);
  }
};

const getMidPointOfScreen = async () => {
  const windowSize = await driver.getWindowSize();
  const middleX = windowSize.width / 2;
  const middleY = windowSize.height / 2;
  return { x: middleX, y: middleY };
};

const dragAndDrop = async (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
) => {
  await driver.performActions([
    {
      type: "pointer",
      id: "finger1",
      parameters: { pointerType: "touch" },
      actions: [
        {
          type: "pointerMove",
          duration: 0,
          x: startX,
          y: startY,
        },
        { type: "pointerDown", button: 0 },
        { type: "pause", duration: 50 },
        {
          type: "pointerMove",
          duration: 0,
          x: endX,
          y: endY,
        },
        { type: "pointerUp", button: 0 },
      ],
    },
  ]);
};

const scrollUpUntilElementCenterIsVisibleOnScreenByHeightCoordinate = async (
  elementSelector: ChainablePromiseElement | string,
  maxScrollAttempts: number = 20,
  errorMsgSupplier?: (locator: string) => string,
  tolerance: number = 10,
) => {
  const elementLocator =
    typeof elementSelector === "string"
      ? elementSelector
      : (await elementSelector.selector).toString();

  const deviceSize = await driver.getWindowSize();

  for (
    let scrollAttempt = 1;
    scrollAttempt <= maxScrollAttempts;
    scrollAttempt++
  ) {
    try {
      const locator: ChainablePromiseElement =
        typeof elementSelector === "string"
          ? $(elementSelector)
          : elementSelector;
      const isVisible = await locator.isDisplayed();
      if (isVisible) {
        const midPoint = await getMiddleOfElement(await locator.getElement());
        if (midPoint.y + tolerance < deviceSize.height) {
          return scrollAttempt > 1;
        }
      }
    } catch {
      // Do nothing
    }
    await scrollOnScreen(ScrollDirection.UP, false);
    await driver.pause(500);
  }

  const errorMessage = errorMsgSupplier
    ? errorMsgSupplier(elementLocator)
    : `Element ${elementLocator} was not visible after scrolling ${maxScrollAttempts} times`;

  throw new Error(errorMessage);
};

const isElementVisibleInTheScreen = async (
  elementLocator: ChainablePromiseElement | string | WebdriverIO.Element,
): Promise<boolean> => {
  try {
    let element: WebdriverIO.Element;
    if (typeof elementLocator === "string") {
      element = await $(elementLocator).getElement();
    } else {
      if (
        "getElement" in elementLocator &&
        typeof elementLocator.getElement === "function"
      ) {
        element = await elementLocator.getElement();
      } else {
        element = elementLocator as WebdriverIO.Element;
      }
    }

    const deviceSize = await driver.getWindowSize();
    const midPoint = await getMiddleOfElement(element);
    const tolerance = 10; // Tolerance in pixels
    const isVisible = await element.isDisplayed();
    return (
      isVisible &&
      midPoint.y + tolerance < deviceSize.height &&
      midPoint.y - tolerance > 0 &&
      midPoint.x + tolerance < deviceSize.width &&
      midPoint.x - tolerance > 0
    );
  } catch {
    return false;
  }
};

/**
 * Scrolls up on the screen until the center of a target element is no longer hidden behind
 * another element (typically a sticky header or overlay).
 *
 * This function is useful when you need to interact with an element that might be obscured
 * by a fixed/sticky UI component. It repeatedly scrolls up and checks if the element's
 * center point has cleared the obstructing element.
 *
 * @param elementSelector - The target element to position. Can be either:
 *   - A string CSS selector (e.g., '#myButton', '.submit-btn')
 *   - A ChainablePromiseElement (WebdriverIO element object)
 *
 * @param wallElementSelector - The obstructing element (e.g., sticky header). Can be either:
 *   - A string CSS selector (e.g., '#header', '.navbar')
 *   - A ChainablePromiseElement (WebdriverIO element object)
 *
 * @param maxScrollAttempts - Maximum number of scroll attempts before giving up.
 *   Default: 20
 *
 * @param errorMsgSupplier - Optional function to generate a custom error message.
 *   Receives the element locator string as a parameter.
 *   Example: (loc) => `Failed to position ${loc} in view`
 *
 * @param tolerance - Vertical pixel buffer to account for minor positioning differences.
 *   The element is considered "clear" if its center is this many pixels above the wall element.
 *   Default: 10 pixels
 *
 * @returns Promise<boolean>
 *   - `true` if scrolling was performed and the element is now positioned correctly
 *   - `false` if the wall element is not visible (nothing to obstruct, no scrolling needed)
 *
 * @throws Error if the element could not be positioned after maxScrollAttempts
 *
 * @example
 * // Scroll until submit button is not behind sticky header
 * const didScroll = await scrollUpUntilElementCenterIsNotBehindOtherElement(
 *   '#submitButton',
 *   '#stickyHeader',
 *   15,
 *   (loc) => `Could not clear ${loc} from header`,
 *   5
 * );
 *
 * @example
 * // Using with WebdriverIO element objects
 * const button = await $('#submitButton');
 * const header = await $('#header');
 * await scrollUpUntilElementCenterIsNotBehindOtherElement(
 *   button,
 *   bottomNavigation);
 */
const scrollUpUntilElementCenterIsNotBehindOtherElement = async (
  elementSelector: ChainablePromiseElement | string,
  wallElementSelector: ChainablePromiseElement | string,
  maxScrollAttempts: number = 20,
  errorMsgSupplier?: (locator: string) => string,
  tolerance: number = 10,
): Promise<boolean> => {
  // Resolve both elements upfront
  const element =
    typeof elementSelector === "string" ? $(elementSelector) : elementSelector;

  const wallElement =
    typeof wallElementSelector === "string"
      ? $(wallElementSelector)
      : wallElementSelector;

  const elementLocatorString =
    typeof elementSelector === "string"
      ? elementSelector
      : (await elementSelector.selector).toString();

  // Early return if wall element not visible
  const isWallVisible = await isElementVisibleInTheScreen(wallElement);
  if (!isWallVisible) {
    return false;
  }

  // Calculate wall element boundary once
  const wallLocation = await wallElement.getLocation();

  for (
    let scrollAttempt = 1;
    scrollAttempt <= maxScrollAttempts;
    scrollAttempt++
  ) {
    try {
      const isVisible = await element.isDisplayed();
      if (isVisible) {
        const midPoint = await getMiddleOfElement(await element.getElement());

        // Element center is above the wall element (not behind it)
        if (midPoint.y + tolerance < wallLocation.y) {
          return scrollAttempt > 1;
        }
      }
    } catch (error) {
      // Log but continue - element might not be in DOM yet
      console.debug(
        `Scroll attempt ${scrollAttempt}: Element not found`,
        error,
      );
    }

    await scrollOnScreen(ScrollDirection.UP, false);
    await driver.pause(500);
  }

  // Failed to position the element after all attempts
  const errorMessage = errorMsgSupplier
    ? errorMsgSupplier(elementLocatorString)
    : `Element ${elementLocatorString} could not be positioned after ${maxScrollAttempts} scroll attempts`;

  throw new Error(errorMessage);
};

export {
  findElementBySwipe,
  swipe,
  scrollOnScreen,
  tapOnElement,
  tapElementAt,
  scrollUntilElementIsVisible,
  scrollUntilElementIsNotVisible,
  scrollOnList,
  pullToRefresh,
  getMiddleOfElement,
  tapAtPoint,
  getMidPointOfScreen,
  dragAndDrop,
  scrollUntilElementIsPresent,
  scrollUpUntilElementCenterIsVisibleOnScreenByHeightCoordinate,
  isElementVisibleInTheScreen,
  scrollToElementInList,
  scrollUpUntilElementCenterIsNotBehindOtherElement,
  tapOutsideOfElementAt,
};
