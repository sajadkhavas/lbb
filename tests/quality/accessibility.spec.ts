import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = ["/", "/shop"] as const;
type AxePage = ConstructorParameters<typeof AxeBuilder>[0]["page"];

for (const route of routes) {
  test(`axe infrastructure runs on ${route}`, async ({ page }, testInfo) => {
    await page.goto(route, { waitUntil: "networkidle" });

    // npm may install Playwright's structural types in two equivalent trees.
    // The runtime Page object is compatible; normalize only the duplicate type identity here.
    const axePage = page as unknown as AxePage;
    const results = await new AxeBuilder({ page: axePage })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    await testInfo.attach(`axe-${route === "/" ? "home" : "shop"}.json`, {
      body: Buffer.from(JSON.stringify(results, null, 2)),
      contentType: "application/json",
    });

    expect(results.testEngine.name).toBe("axe-core");
    expect(results.testEngine.version).toMatch(/^\d+\.\d+\.\d+/);
  });
}
