# Backend SEO Data Handoff — BE-D / F20-B

This document specifies **data semantics**, not endpoint URLs. Backend may expose these records through whatever API shape is chosen by the Backend architecture, provided the public frontend can obtain the fields and states below consistently.

## Cross-cutting publication contract

Every SEO-addressable entity needs an explicit public lifecycle instead of “if a record exists, index it”. Recommended semantic fields:

```ts
type PublicationState = "draft" | "published" | "archived";

type SeoPublication = {
  publication: PublicationState;
  publishedAt: string | null;
  updatedAt: string | null;
  canonicalSlug: string;
  previousSlugs?: string[];
};
```

`publishedAt`/`updatedAt` are facts, not generated current timestamps. `previousSlugs` is only populated from real slug history and supports redirect migration.

## Generic SEO fields

Backend should allow entity-specific defaults with optional reviewed overrides:

```ts
type SeoFields = {
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalOverride: string | null;
  socialTitle: string | null;
  socialDescription: string | null;
  socialImage: PublicMedia | null;
};
```

Rules:

- `canonicalOverride` is exceptional; normal canonical is derived from canonical slug + route family.
- Backend must not accept arbitrary external canonical URLs without validation/business need.
- Empty override means frontend derives a safe default.
- Metadata must not advertise unverified price, shipping, returns, payment or stock claims.

## Public media DTO

```ts
type PublicMedia = {
  url: string;
  alt: string;
  width: number;
  height: number;
  mimeType?: string;
  role?: "primary" | "gallery" | "social" | "editorial";
};
```

Required semantics:

- public resolvable URL or frontend-transformable asset identifier;
- intrinsic width/height;
- human-authored/approved alt where the image conveys information;
- primary image explicitly identified rather than guessed from array order when possible.

## Product SEO DTO

The frontend needs:

```ts
type ProductSeoDto = {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription?: string;
  sku: string;
  brand: string;
  media: PublicMedia[];
  primaryImage: PublicMedia;
  price: { amount: number; currency: string } | null;
  originalPrice: { amount: number; currency: string } | null;
  availability: "in_stock" | "out_of_stock" | "preorder" | "backorder" | null;
  colors: string[];
  sizes: string[];
  variants: Array<{
    id: string;
    sku?: string;
    color?: string;
    size?: string;
    availability: "in_stock" | "out_of_stock" | "preorder" | "backorder" | null;
    price?: { amount: number; currency: string } | null;
  }>;
  category: { slug: string; name: string };
  collections: Array<{ slug: string; name: string }>;
  publication: SeoPublication;
  seo: SeoFields;
  evidence: ProductSeoEvidence;
};
```

### Product evidence

F14C already establishes per-field verification. Backend must preserve that concept rather than collapsing it to a single boolean:

```ts
type EvidenceState = "verified" | "pending" | "missing";

type EvidenceEntry = {
  state: EvidenceState;
  sourceRef: string | null;
  reviewedAt: string | null;
};

type ProductSeoEvidence = {
  name: EvidenceEntry;
  media: EvidenceEntry;
  price: EvidenceEntry;
  originalPrice: EvidenceEntry;
  colors: EvidenceEntry;
  sizes: EvidenceEntry;
  stock: EvidenceEntry;
  description: EvidenceEntry;
  material: EvidenceEntry;
  care: EvidenceEntry;
  fit: EvidenceEntry;
  sku: EvidenceEntry;
  collection: EvidenceEntry;
};
```

Frontend Product/Offer schema eligibility requires the publication/evidence gate, not merely non-null values.

## Category DTO

```ts
type CategorySeoDto = {
  slug: string;
  name: string;
  h1: string;
  intro: string;
  metaTitle: string | null;
  metaDescription: string | null;
  heroMedia: PublicMedia | null;
  publication: SeoPublication;
  productIds: string[];
};
```

Product IDs returned in a category do not automatically mean those products are public. Frontend filters ItemList/sitemap links through product publication eligibility.

## Collection DTO

```ts
type CollectionSeoDto = {
  slug: string;
  name: string;
  description: string;
  heroMedia: PublicMedia | null;
  productIds: string[];
  publication: SeoPublication;
  seo: SeoFields;
};
```

Collections are merchandising/editorial entities, not aliases for categories. Backend should not auto-create collections from every facet combination.

## Article DTO

```ts
type ArticleSeoDto = {
  slug: string;
  title: string;
  excerpt: string;
  body: unknown;
  cover: PublicMedia;
  section: string | null;
  publication: SeoPublication;
  seo: SeoFields;
  author?: { name: string; url?: string | null } | null;
};
```

`publishedAt` and `updatedAt` come from editorial publication history.

## Store/entity/local SEO DTO

Current verified baseline is Karaj / Mehestan Passage. Backend should expose location fields with verification state, not nullable strings that frontend blindly publishes:

```ts
type VerifiedValue<T> = {
  value: T | null;
  verification: "verified" | "pending" | "missing";
};

type StoreSeoDto = {
  name: string;
  alternateName?: string | null;
  city: VerifiedValue<string>;
  province: VerifiedValue<string>;
  venue: VerifiedValue<string>;
  streetAddress: VerifiedValue<string>;
  postalCode: VerifiedValue<string>;
  latitude: VerifiedValue<number>;
  longitude: VerifiedValue<number>;
  openingHours: VerifiedValue<string[]>;
  phone: VerifiedValue<string>;
  email: VerifiedValue<string>;
  socialProfiles: Array<{ url: string; verification: "verified" | "pending" | "missing" }>;
};
```

Frontend schema/metadata includes only public verified values. Backend must not default unknown location data to Tehran or infer address/hours from third-party sources without store approval.

## Sitemap handoff

F20-B needs a publication-aware feed of canonical entities, conceptually:

```ts
type SitemapEntity = {
  kind: "product" | "category" | "collection" | "article";
  slug: string;
  publication: "published";
  updatedAt: string | null;
};
```

Frontend decides route path. Backend does not need to return pre-rendered XML.

Requirements:

- no drafts/archived records;
- no query-string variants;
- `updatedAt` only when meaningful;
- deterministic pagination/streaming if entity counts grow;
- deleted/archived records must stop appearing promptly.

## Redirect/slug history

When canonical slugs change, Backend should expose enough history for F20-B/server routing to distinguish:

- old known slug → permanent redirect to current canonical;
- unknown slug → 404;
- intentionally removed resource → 404 or 410 according to product/content policy;
- temporary Backend outage → 5xx, never fake 404.

Do not infer redirects from fuzzy title/name matching.

## HTTP failure semantics required from integration

Frontend must be able to distinguish:

- `not_found` — invalid resource → HTTP 404;
- `unpublished` — public request must not expose draft; typically 404 to public traffic;
- `archived` — terminal/redirect policy based on explicit replacement/history;
- `temporarily_unavailable` — 5xx/retry behavior, not 404;
- validation errors — 4xx appropriate to request, not SEO landing content.

## Explicitly not requested from BE-D in F20-A

- No mandated `/api/seo/...` endpoint family.
- No server-rendered HTML/meta payload.
- No keyword-volume fields.
- No generated keyword stuffing.
- No automatic canonical based on request referrer.
- No fabricated `lastmod` timestamps.

The contract is satisfied when Backend can provide trustworthy publication-aware fields regardless of transport/API naming.
