# Image SEO & Social Preview Contract

F20-A defines semantic/media requirements. Image delivery pipeline optimization, compression strategy and broad performance work belong to F21.

## Alt text

1. Informative images receive concise text describing what is useful in context.
2. Decorative imagery uses empty alt/appropriate decorative semantics rather than keyword stuffing.
3. Product image alt may contain verified product identity, visible color/view and brand where useful; it must not invent material, fit or availability.
4. Multiple gallery images should not repeat the exact same long alt when their view/content differs.
5. Logo/brand marks identify the brand rather than describing visual decoration.

## Filename policy

Where filenames are controllable at upload/Backend level:

- stable descriptive ASCII slugs are preferred;
- avoid opaque tracking IDs as the only semantic filename when an asset pipeline can preserve a meaningful identifier;
- do not rename solely to insert keyword variants;
- filename is secondary to page context, alt and structured data.

Existing bundled assets are not bulk-renamed by F20-A.

## Intrinsic dimensions

Public media DTO should provide `width` and `height`. Rendered images should preserve intrinsic dimensions/aspect ratio to reduce layout shift and allow responsive selection.

## Responsive images

F21/media implementation should support `srcset`/`sizes` or the framework-equivalent where useful. F20-A requires that responsive variants represent the same source image/content and preserve correct alt semantics.

## Loading priority

- Above-the-fold primary/hero product media may use eager/high priority when justified.
- Below-the-fold gallery/editorial media defaults to lazy loading.
- Do not set every product-grid image to high priority.
- SEO contract does not override performance evidence.

## Primary image

Each publishable product should expose an explicit primary image in Backend data. Frontend must not permanently assume array index 0 if the operational system has a real primary-image field.

Primary Product schema and social preview image must refer to public media belonging to that product.

## Structured-data media

Product/Article/Collection structured-data images must:

- be absolute public URLs in production;
- represent visible page content;
- belong to the correct entity;
- not expose draft/unpublished media as production schema;
- use verified product media before Product schema is emitted.

## Social preview contract

Every canonical indexable content page should provide:

- `og:title`;
- `og:description`;
- `og:type`;
- absolute `og:url`;
- absolute `og:image` where an appropriate image exists;
- `twitter:card` at site/root level or page level;
- `twitter:title`;
- `twitter:description`;
- absolute `twitter:image`.

Noindex is an indexing instruction, not a “cannot be shared” instruction. Shareable filter/search URLs may retain social preview basics even though their canonical points to the clean page and they remain noindex.

## Social image fallback

The existing site fallback may be used when a page-specific verified image is absent. Product/article media should replace it only when that media is valid for the entity.

F20-B may later introduce purpose-built social assets. F20-A does not create fake product imagery or claim that a generic icon is a product photograph.

## Absolute URL rule

In production, canonical, Open Graph URL/image, Twitter image, structured-data media and sitemap locations must be absolute HTTPS URLs derived from the configured clean site origin. Development may retain relative fallback behavior when `VITE_SITE_URL` is intentionally absent.

## Test gates

SEO tests verify:

- canonical URLs are absolute under configured production-origin build/dev test environment;
- social image URLs are absolute;
- noindex search retains social preview image basics;
- draft product schema is absent rather than advertising unverified media/commerce facts;
- Article main entity/image data is public/absolute where current implementation emits it.

Detailed responsive-image performance tests are deferred to F21.
