/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect, type Page, BrowserContext } from "@playwright/test";
import { AuthUtil } from "./utils/AuthUtil";

const HOST = "localhost:3000";

test.describe.serial("App smoke test from login to create item. #p1", () => {
  const now = Date.now();
  const emailA = `test-user_A${now}@test.com`;
  const emailB = `test-user_B${now}@test.com`;
  const password = "tony1234";
  const name = "testUser_" + now;

  let context1: BrowserContext;
  let context2: BrowserContext;
  let testUserPageA: Page;
  let testUserPageB: Page;

  let authUtilA: AuthUtil;
  let authUtilB: AuthUtil;

  test.beforeAll(async ({ browser }) => {
    context1 = await browser.newContext();
    testUserPageA = await context1.newPage();

    context2 = await browser.newContext();
    testUserPageB = await context2.newPage();

    authUtilA = new AuthUtil(testUserPageA, HOST);
    authUtilB = new AuthUtil(testUserPageB, HOST);
  });
  test.beforeEach(async () => {
    await testUserPageA.goto(HOST);
    await testUserPageB.goto(HOST);
  });

  test("When come to home we should be redirect to login", async () => {
    const login = testUserPageA.getByRole("heading", { name: "Login!" });
    await expect(login).toBeVisible();
  });

  test("Signup user successfully", async () => {
    await authUtilA.signupUser(emailA, password, name);
    await authUtilB.signupUser(emailB, password, name);

    await expect(testUserPageA.getByText("Tony's Home")).toBeVisible();
    await expect(testUserPageB.getByText("Tony's Home")).toBeVisible();
  });

  test("When user A create and publish bidItem user B also can see", async () => {
    const userAvatarXpath = 'xpath=//span[@data-testid="AVATAR"]';

    await testUserPageA.click(userAvatarXpath);
    await testUserPageA.isVisible(createNewItemButton);
    await testUserPageA.click(createNewItemButton);

    await testUserPageA.getByTestId("CREATE_NEW_BTN").isVisible();
    await testUserPageA.getByTestId("CREATE_NEW_BTN").click();
    await testUserPageA.isVisible('xpath=//header[text()="Enter bid price"]');
    await testUserPageA
      .getByRole("textbox", { name: "name" })
      .type(`Item_${now}`, { delay: 50 });
    await testUserPageA
      .getByRole("textbox", { name: "body" })
      .type(`Description here`, { delay: 50 });
    await testUserPageA
      .locator(INPUT_XPATH_BY_NAME("startPrice"))
      .type("200", { delay: 50 });
    await testUserPageA
      .locator(INPUT_XPATH_BY_NAME("timeWindow"))
      .type("2", { delay: 50 });

    await testUserPageA.click('xpath=//button[text()="Submit"]');
    await testUserPageA.isVisible(
      `xpath=//div[@data-testid="MY_BID_ITEM"]//p[text()="Item_${now}"]`
    );

    await testUserPageA.click('xpath=//button[text()="Publish"]');
    await testUserPageB
      .getByTestId("ONGOING_AUCTION")
      .getByText(`Item_${now}`)
      .isVisible();
  });
});

export const INPUT_XPATH_BY_NAME = (name: string) =>
  `xpath=//input[@name="${name}"]`;
export const ONGOING_AUCTION_XPATH = (name: string) =>
  `xpath=//div[@data-testid="ONGOING_AUCTION"]//p[text()="${name}"`;
export const createNewItemButton = 'xpath=//button[text()="Create new item"]';
