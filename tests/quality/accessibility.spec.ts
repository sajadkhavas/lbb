import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = ["/", "/shop"] as const;

for (const route of routes) {
  test(`axe infrastructure runs on ${route}`, async ({ page }, testInfo) => {
    await page.goto(route, { waitUntil: "networkidle" });

    const results = await new AxeBuilder({ page })
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
