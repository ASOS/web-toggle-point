import { test, expect } from "@playwright/test";
import getFixtureURL from "../playwright.getFixtureUrl";
const fixtureURL = getFixtureURL(import.meta.url);

test.describe("varying a hook", () => {
  test.describe("when no content editor cookie is set", () => {
    test("it shows a default experience", async ({ page }) => {
      await page.goto(fixtureURL);
      await expect(page.locator("body")).not.toHaveAttribute(
        "data-design-mode"
      );
    });
  });

  test.describe("when a content editor cookie is set", () => {
    test.beforeEach(async ({ page }) => {
      await page.context().addCookies([
        {
          name: "i-am-a-content-editor",
          value: "true",
          path: "/",
          domain: "localhost"
        }
      ]);
      await page.goto(fixtureURL);
    });

    test("it shows a varied experience", async ({ page }) => {
      await expect(page.locator("body")).toHaveAttribute(
        "data-design-mode",
        "true"
      );
    });
  });
});
