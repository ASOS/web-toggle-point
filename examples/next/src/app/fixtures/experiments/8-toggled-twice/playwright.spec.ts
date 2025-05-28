import { test, expect } from "@playwright/test";
import setExperimentHeaders from "../playwright.setExperimentHeaders";
import locateWithinExample from "../playwright.locateInExample";
import getFixtureURL from "../../playwright.getFixtureUrl";
const fixtureURL = getFixtureURL(import.meta.url);

test.describe("varying a component and varying again with a different toggle point, loading mode, file convention", () => {
  test.describe("when no experiments header set", () => {
    test("it shows the control module", async ({ page }) => {
      await page.goto(fixtureURL);
      await expect(locateWithinExample(page, "control 1")).toBeVisible();
    });
  });

  test.describe("when an experiments header set", () => {
    setExperimentHeaders(test);

    test("it shows a varied module", async ({ page }) => {
      await page.goto(fixtureURL);
      await expect(locateWithinExample(page, "variant 1")).toBeVisible();
    });

    test.describe("when the 'a' key is pressed", () => {
      test('it shows "variant 1" and a paragraph with "pressed: a"', async ({
        page
      }) => {
        await page.goto(fixtureURL);
        await page.waitForTimeout(50);
        await page.keyboard.down("a");
        await expect(locateWithinExample(page, "variant 1")).toBeVisible();
        await expect(
          page.locator("p", { hasText: "pressed: a" })
        ).toBeVisible();
      });
    });

    test.describe("when the 'n' key is pressed", () => {
      test('it shows "variant 2" and a paragraph with "pressed: n"', async ({
        page
      }) => {
        await page.goto(fixtureURL);
        await page.waitForTimeout(50);
        await page.keyboard.down("n");
        await expect(locateWithinExample(page, "variant 2")).toBeVisible();
        await expect(
          page.locator("p", { hasText: "pressed: n" })
        ).toBeVisible();
      });
    });
  });
});
