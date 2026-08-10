import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");
const gallery = read("src/components/lbb/product/Gallery.tsx");
const quick = read("src/components/lbb/ProductQuickView.tsx");
const cart = read("src/components/lbb/CartDrawer.tsx");
const filters = read("src/components/lbb/ProductGridControls.tsx");
const checkout = read("src/routes/checkout.tsx");
const card = read("src/components/lbb/ProductCard.tsx");
const facts = read("src/components/lbb/product/ProductFacts.tsx");
const rtlTests = read("tests/f19-rtl.spec.ts");

const required = [
  [gallery, 'dir="rtl"', "PDP gallery exposes RTL direction"],
  [gallery, "getBoundingClientRect()", "gallery active index avoids raw RTL scrollLeft math"],
  [quick, "h-11 w-11 overflow-hidden", "Quick View thumbnails meet 44px target"],
  [quick, 'event.key === "ArrowLeft"', "Quick View keyboard direction is explicit"],
  [cart, "h-11 w-11 place-items-center", "Cart quantity targets meet 44px"],
  [filters, "min-h-11 items-center", "filter chips meet 44px"],
  [checkout, 'aria-invalid={error ? "true" : undefined}', "checkout exposes aria-invalid"],
  [checkout, "aria-describedby={error ? errorId : undefined}", "checkout errors are associated"],
  [checkout, "noValidate", "checkout custom validation is not blocked by native browser UI"],
  [
    checkout,
    "document.getElementById(`co-${first}`)?.focus()",
    "checkout focuses first custom error",
  ],
  [card, "aria-label={`رنگ‌های موجود:", "product cards announce color names"],
  [facts, "<Identifier>{model.identity.sku}</Identifier>", "PDP SKU uses bidi isolation"],
];
for (const [source, token, message] of required) {
  if (!source.includes(token)) throw new Error(`F19-B audit failed: ${message}`);
}
if (
  rtlTests.includes('test.fail(true, "F19B-P1-004') ||
  rtlTests.includes('test.fail(true, "F19B-P2-001') ||
  rtlTests.includes('test.fail(true, "F19B-P2-002')
) {
  throw new Error("F19-B audit failed: active touch debt is still marked expected-failure");
}
console.log("F19-B remediation audit: PASS");
