import { readFile, writeFile } from "node:fs/promises";

const routePath = "src/routes/shipping-returns.tsx";
const testPath = "tests/p4-content-legal-d2.spec.ts";

let route = await readFile(routePath, "utf8");

const replacements = [
  [
    `async function resolveLiveDeliveryPolicy(): Promise<LiveDeliveryPolicy | null> {
  if (!isLiveBackend()) return null;

  const [tehran, karaj, nationwide] = await Promise.all([
    getDeliveryOptions({ province: "تهران", city: "تهران" }),
    getDeliveryOptions({ province: "البرز", city: "کرج" }),
    getDeliveryOptions({ province: "اصفهان", city: "اصفهان" }),
  ]);

  return {
    tehran: tehran.data,
    karaj: karaj.data,
    nationwide: nationwide.data,
  };
}
`,
    `async function resolveLiveShippingCards(): Promise<ShippingCard[] | null> {
  if (!isLiveBackend()) return null;

  const [tehran, karaj, nationwide] = await Promise.all([
    getDeliveryOptions({ province: "تهران", city: "تهران" }),
    getDeliveryOptions({ province: "البرز", city: "کرج" }),
    getDeliveryOptions({ province: "اصفهان", city: "اصفهان" }),
  ]);

  return backendShippingCards({
    tehran: tehran.data,
    karaj: karaj.data,
    nationwide: nationwide.data,
  });
}
`,
  ],
  [
    `    const [page, delivery] = await Promise.all([
      resolveOptionalStorefrontPage("shipping-returns"),
      resolveLiveDeliveryPolicy(),
    ]);

    return { page, delivery };
`,
    `    const [page, shippingCards] = await Promise.all([
      resolveOptionalStorefrontPage("shipping-returns"),
      resolveLiveShippingCards(),
    ]);

    return { page, shippingCards };
`,
  ],
  [
    `function ShippingState({ delivery }: { delivery: LiveDeliveryPolicy | null }) {
  if (delivery) return <ShippingCards cards={backendShippingCards(delivery)} />;
`,
    `function ShippingState({ cards }: { cards: ShippingCard[] | null }) {
  if (cards) return <ShippingCards cards={cards} />;
`,
  ],
  [
    `  const { page, delivery } = Route.useLoaderData();
  const { shipping, returns } = STORE_SETTINGS;
  const shippingPublished = delivery
    ? backendShippingCards(delivery).length > 0
    : canPublishShipping();
`,
    `  const { page, shippingCards } = Route.useLoaderData();
  const { shipping, returns } = STORE_SETTINGS;
  const shippingPublished = shippingCards ? shippingCards.length > 0 : canPublishShipping();
`,
  ],
  [
    `            <ShippingState delivery={delivery} />
`,
    `            <ShippingState cards={shippingCards} />
`,
  ],
];

for (const [before, after] of replacements) {
  const first = route.indexOf(before);
  const second = route.indexOf(before, first + 1);
  if (first === -1 || second !== -1) {
    throw new Error(`Unexpected route replacement cardinality for ${before.slice(0, 80)}`);
  }
  route = route.replace(before, after);
}

await writeFile(routePath, route);

let test = await readFile(testPath, "utf8");
const anchor = `  expect(shipping).toContain('city: "کرج"');
  expect(shipping).not.toContain("پست پیشتاز");
`;
const replacement = `  expect(shipping).toContain('city: "کرج"');
  expect(shipping).toContain("return { page, shippingCards };");
  expect(shipping).not.toContain("return { page, delivery };");
  expect(shipping).toContain("return backendShippingCards({");
  expect(shipping).not.toContain("<ShippingState delivery={delivery} />");
  expect(shipping).not.toContain("پست پیشتاز");
`;

const first = test.indexOf(anchor);
const second = test.indexOf(anchor, first + 1);
if (first === -1 || second !== -1) {
  throw new Error("Unexpected D2 test anchor cardinality");
}

test = test.replace(anchor, replacement);
await writeFile(testPath, test);

console.log("D2_SHIPPING_HYDRATION_PATCH=APPLIED");
