# PDP information architecture

## Decision order

The product page follows this order:

1. Product identity.
2. Verified price.
3. Verified availability.
4. Color decision.
5. Size decision.
6. Decision help and product-specific size guide.
7. Purchase action.
8. Verified product facts.
9. Verified media and measurements.
10. Publishable styling and related-product discovery.

## Desktop

Desktop uses a two-column decision area: gallery on the visual side and a sticky decision panel on the commerce side. The purchase panel remains bounded to the PDP and does not change global cart persistence.

## Mobile

Mobile stacks media before the decision panel. A sticky purchase surface appears only after the primary purchase action leaves the viewport and is positioned above the existing mobile bottom navigation and safe-area inset.

## Pending product state

When required product evidence is not public:

- the H1 becomes a generic pending-data title;
- price, stock, colors and sizes are not copied from prototype data;
- media is replaced with an explicit no-fake-media state;
- purchase remains disabled;
- fit, material, care, measurements, related and recently viewed cards do not expose draft facts.

The route remains usable and accessible instead of becoming a broken skeleton.
