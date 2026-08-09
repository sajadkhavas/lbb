import fs from "node:fs";

function patchFile(path, transform) {
  const before = fs.readFileSync(path, "utf8");
  const after = transform(before);
  if (after === before) {
    console.log(`UNCHANGED ${path}`);
    return;
  }
  fs.writeFileSync(path, after);
  console.log(`PATCHED ${path}`);
}

patchFile("src/lib/backend-api.ts", (text) => {
  if (!text.includes("function buildRequestHeaders(init: RequestInit): Headers")) {
    const marker = "async function request<T>(\n";
    if (!text.includes(marker)) throw new Error("backend request marker not found");
    const helper = `function buildRequestHeaders(init: RequestInit): Headers {\n  const headers = new Headers(init.headers);\n  headers.set(\"Accept\", \"application/json\");\n  if (init.body) headers.set(\"Content-Type\", \"application/json\");\n\n  const method = (init.method ?? \"GET\").toUpperCase();\n  if (typeof document !== \"undefined\" && ![\"GET\", \"HEAD\", \"OPTIONS\"].includes(method)) {\n    const entry = document.cookie\n      .split(\"; \")\n      .find((cookie) => cookie.startsWith(\"XSRF-TOKEN=\"));\n    if (entry) {\n      const token = entry.slice(\"XSRF-TOKEN=\".length);\n      headers.set(\"X-XSRF-TOKEN\", decodeURIComponent(token));\n    }\n  }\n\n  return headers;\n}\n\n`;
    text = text.replace(marker, helper + marker);
  }

  if (!text.includes("headers: buildRequestHeaders(init),")) {
    const block = `      headers: {\n        Accept: \"application/json\",\n        ...(init.body ? { \"Content-Type\": \"application/json\" } : {}),\n        ...init.headers,\n      },`;
    if (!text.includes(block)) throw new Error("backend header block not found");
    text = text.replace(block, "      headers: buildRequestHeaders(init),");
  }
  return text;
});

patchFile("src/components/lbb/ProductCard.tsx", (text) => {
  const importAnchor = `import type { BackendCatalogCard } from \"@/lib/backend-storefront\";\n`;
  if (!text.includes(`import { isLiveBackend } from \"@/lib/backend-api\";`)) {
    if (!text.includes(importAnchor)) throw new Error("ProductCard import anchor not found");
    text = text.replace(
      importAnchor,
      `${importAnchor}import { isLiveBackend } from \"@/lib/backend-api\";\n`,
    );
  }

  if (!text.includes("BACKEND PRODUCT ONLY")) {
    const marker = `  useEffect(() => {\n    setLoaded(false);\n    if (imgRef.current?.complete) setLoaded(true);\n  }, [primaryImage]);\n`;
    if (!text.includes(marker)) throw new Error("ProductCard hook-safe marker not found");
    const guard = `\n  if (!backend && isLiveBackend()) {\n    return (\n      <article className=\"flex min-h-72 flex-col justify-between border border-hairline bg-carbon p-5\">\n        <div>\n          <TechLabel tone=\"metal\">BACKEND PRODUCT ONLY</TechLabel>\n          <p className=\"mt-4 text-sm leading-7 text-metal\">\n            این جایگاه هنوز به محصول منتشرشده Backend متصل نشده است؛ داده نمونه در حالت live نمایش داده نمی‌شود.\n          </p>\n        </div>\n        <Link\n          to=\"/shop\"\n          search={{}}\n          className=\"mt-6 inline-flex min-h-11 items-center justify-center border border-hairline px-3 text-xs font-semibold text-bone transition hover:border-signal hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal\"\n        >\n          مشاهده کاتالوگ زنده\n        </Link>\n      </article>\n    );\n  }\n`;
    text = text.replace(marker, marker + guard);
  }
  return text;
});

patchFile("src/routes/product.$slug.tsx", (text) => {
  const before = `function LiveProductPage({ loader }: { loader: LiveLoader }) {\n  const product = loader.product;\n  if (!product) {\n    return (\n      <PageChrome theme=\"light\">\n        <Shell className=\"py-16\">\n          <EmptyState\n            icon={<RefreshCcw size={40} aria-hidden=\"true\" />}\n            title=\"اطلاعات محصول قابل تأیید نیست\"\n            body={loader.error ?? \"Backend پاسخ معتبر برای این محصول برنگرداند.\"}\n            action={<Link to=\"/shop\" className={CtaClasses(\"line\")}>بازگشت به فروشگاه</Link>}\n          />\n        </Shell>\n      </PageChrome>\n    );\n  }\n\n  const model = useMemo(() => backendDecisionModel(product), [product]);\n  const [galleryMedia, setGalleryMedia] = useState<DecisionMedia[]>(model.media);\n  const updateGallery = useCallback((media: DecisionMedia[]) => setGalleryMedia(media), []);\n\n  useEffect(() => setGalleryMedia(model.media), [model]);\n`;
  const after = `function LiveProductPage({ loader }: { loader: LiveLoader }) {\n  const product = loader.product;\n  const model = useMemo(() => (product ? backendDecisionModel(product) : null), [product]);\n  const [galleryMedia, setGalleryMedia] = useState<DecisionMedia[]>(model?.media ?? []);\n  const updateGallery = useCallback((media: DecisionMedia[]) => setGalleryMedia(media), []);\n\n  useEffect(() => setGalleryMedia(model?.media ?? []), [model]);\n\n  if (!product || !model) {\n    return (\n      <PageChrome theme=\"light\">\n        <Shell className=\"py-16\">\n          <EmptyState\n            icon={<RefreshCcw size={40} aria-hidden=\"true\" />}\n            title=\"اطلاعات محصول قابل تأیید نیست\"\n            body={loader.error ?? \"Backend پاسخ معتبر برای این محصول برنگرداند.\"}\n            action={<Link to=\"/shop\" className={CtaClasses(\"line\")}>بازگشت به فروشگاه</Link>}\n          />\n        </Shell>\n      </PageChrome>\n    );\n  }\n`;
  if (text.includes(after)) return text;
  if (!text.includes(before)) throw new Error("LiveProductPage hook block not found");
  return text.replace(before, after);
});
