import { test, expect } from "@playwright/test";

test.describe("parallel folder convention endpoint", () => {
  test.describe("with no version header", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("http://localhost:3002/parallel-folder-convention/");
    });

    test("it shows the control experience", async ({ page }) => {
      const control = page.getByTestId("control 1");
      await expect(control).toBeAttached();
      await expect(control.getByText("🐶")).toBeAttached();
      await expect(control.getByTestId("control 2")).toBeAttached();
      await expect(
        page.locator(':nth-match(:text("Control 2"), 2)')
      ).toBeAttached();
    });

    test.describe("when clicking on the dog button", () => {
      test.beforeEach(async ({ page }) => {
        await page.getByRole("button").click();
      });

      test("it adds a dog to the lower container", async ({ page }) => {
        await page.getByRole("button").click();
        await expect(
          page.locator(':nth-match(:text("Control 2"), 2) :text("🐶")')
        ).toBeAttached();
      });

      test.describe("when changing the feature to 'feature 1'", () => {
        test.beforeEach(async ({ page }) => {
          await page.getByRole("combobox").selectOption("feature 1 🐱");
        });

        test("it shows a varied experience", async ({ page }) => {
          const control = page.getByTestId("variant 1");
          await expect(control).toBeAttached();
          await expect(control.getByText("🐱")).toBeAttached();
          await expect(control.getByText("🐱")).toHaveCSS(
            "background-color",
            "rgb(245, 222, 179)"
          );
          await expect(page.getByTestId("variant 2")).toBeAttached();
        });

        test("it preserves the state", async ({ page }) => {
          await expect(
            page.locator(':text("Variant 2") :text("🐶")')
          ).toBeAttached();
        });

        test.describe("when clicking on the cat button", () => {
          test.beforeEach(async ({ page }) => {
            await page.getByRole("button").click();
          });

          test("it adds a cat to the lower container", async ({ page }) => {
            await expect(
              page.locator(':text("Variant 2") :text("🐱")')
            ).toBeAttached();
          });

          test.describe("when changing the feature to 'feature 2'", () => {
            test.beforeEach(async ({ page }) => {
              await page.getByRole("combobox").selectOption("feature 2 🐹");
            });

            test("it shows a different varied experience", async ({ page }) => {
              const control = page.getByTestId("control 1");
              await expect(control).toBeAttached();
              await expect(control.getByTestId("control 2")).toBeAttached();
              await expect(control.getByText("🐹")).toBeAttached();
              await expect(control.getByText("⛓️‍💥")).toBeAttached();
              await expect(
                page.locator(':nth-match(:text("Control 2"), 2)')
              ).toBeAttached();
            });

            test("it preserves the state", async ({ page }) => {
              await expect(
                page.locator(':text("Control 2") :text("🐶🐱")')
              ).toBeAttached();
            });

            test.describe("when clicking the 'free the animals' button", () => {
              test.beforeEach(async ({ page }) => {
                await page.getByRole("button", { name: "⛓️‍💥" }).click();
              });

              test("it clears the state", async ({ page }) => {
                await expect(
                  page.locator(':nth-match(:text("Control 2"), 2)')
                ).toHaveText("Control 2");
              });
            });
          });
        });
      });
    });
  });

  test.describe("when a 'feature2' feature header is sent with the request", () => {
    test.beforeEach(async ({ page }) => {
      await page.setExtraHTTPHeaders({ feature: "feature2" });
      await page.goto("http://localhost:3002/parallel-folder-convention/");
    });

    test("it shows the varied experience (default state with two hamsters)", async ({
      page
    }) => {
      const control = page.getByTestId("control 1");
      await expect(control).toBeAttached();
      await expect(control.getByText("🐹")).toBeAttached();
      await expect(
        page.locator(':nth-match(:text("Control 2"), 2) :text("🐹🐹")')
      ).toBeAttached();
    });

    test.describe("when changing the feature to 'feature 5'", () => {
      test.beforeEach(async ({ page }) => {
        await page.getByRole("combobox").selectOption("feature 5 🪐");
      });

      test("shows the varied experience (new store & slice)", async ({
        page
      }) => {
        const control = page.getByTestId("variant 2");
        await expect(control).toBeAttached();
        await expect(control.getByText("🌎🪐☄️🛸")).toBeAttached();
      });

      test("it maintains the previous state (two hamsters shown before)", async ({
        page
      }) => {
        await expect(
          page.locator(':text("Control 2") :text("🐹🐹")')
        ).toBeAttached();
      });
    });
  });

  test.describe("when a 'feature3' feature header is sent with the request", () => {
    test.beforeEach(async ({ page }) => {
      await page.setExtraHTTPHeaders({ feature: "feature3" });
      await page.goto("http://localhost:3002/parallel-folder-convention/");
    });

    test("it shows the varied experience", async ({ page }) => {
      const control = page.getByTestId("control 1");
      await expect(control).toBeAttached();
      await expect(control.getByText("🐰")).toBeAttached();
    });

    test.describe("when clicking on the rabbit button", () => {
      test.beforeEach(async ({ page }) => {
        await page.getByRole("button").click();
      });

      test("it adds a rabbit to the container", async ({ page }) => {
        await expect(
          page.locator(':nth-match(:text("Control 2"), 2) :text("🐰")')
        ).toBeAttached();
      });

      test.describe("when clicking on the rabbit button another two times", () => {
        test.beforeEach(async ({ page }) => {
          await page.getByRole("button").click();
          await page.getByRole("button").click();
        });

        test("it adds three more rabbits to the container (multiplying redux action)", async ({
          page
        }) => {
          await expect(
            page.locator(':nth-match(:text("Control 2"), 2) :text("🐰🐰🐰🐰")')
          ).toBeAttached();
        });

        test.describe("when changing the feature to 'feature 4'", () => {
          test.beforeEach(async ({ page }) => {
            await page.getByRole("combobox").selectOption("feature 4 🦀");
          });

          test("it shows the varied experience (selector that modifies existing state)", async ({
            page
          }) => {
            const control = page.getByTestId("control 1");
            await expect(control).toBeAttached();
            await expect(control.getByText("🦀")).toBeAttached();
            await expect(
              page.locator(
                ':nth-match(:text("Control 2"), 2) :text("🦀🦀🦀🦀")'
              )
            ).toBeAttached();
          });
        });
      });
    });
  });
});
