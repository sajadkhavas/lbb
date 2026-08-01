# LBB

# LBB — Homepage Prompt for Lovable (Phase 1)
### Full Modern 3D | SSR-Ready | Red & White | Streetwear Boutique

---

> **HOW TO USE:** Start a brand-new Lovable project (after May 13, 2026 — gets TanStack Start + SSR by default). Paste the prompt below as your very first message. Do NOT use this on an old project.

---

## ═══════════════════════════════════════════
## THE PROMPT (copy everything below this line)
## ═══════════════════════════════════════════

```
Build a stunning, award-winning homepage for "LBB" — a premium Iranian streetwear boutique selling hoodies, pants, t-shirts, sneakers, and accessories. The visual identity is bold crimson red (#E8001D), pure white (#FFFFFF), and deep matte black (#0A0A0A). The design must feel like a Awwwards-level creative experience — not a template. Every person who lands on this site should feel immediately impressed.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1 — STACK & ARCHITECTURE (MANDATORY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Use TanStack Start with full SSR. The homepage route ("/") must:
- Return fully-formed HTML on the first server response (no empty 

)
- Include all meta tags in the server-rendered : title, meta description, canonical URL, og:title, og:description, og:image, og:type="website", twitter:card
- Include a JSON-LD ClothingStore schema in :
  {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "name": "LBB",
    "url": "https://lbbclo.com",
    "image": "https://lbbclo.com/og-image.jpg",
    "description": "Premium Iranian streetwear boutique. Hoodies, pants, t-shirts, sneakers, and accessories.",
    "address": { "@type": "PostalAddress", "addressCountry": "IR" },
    "sameAs": ["https://www.instagram.com/lbbclo"]
  }
- Generate a /robots.txt route that allows all crawlers and points to /sitemap.xml
- Generate a /sitemap.xml route listing: /, /shop, /hoodies, /pants, /tshirts, /shoes, /accessories, /about, /contact

All components that access window, document, or browser APIs must be wrapped in a client-only boundary or useEffect. No hydration mismatches.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2 — CUSTOM CURSOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Replace the default cursor with a custom cursor system (client-only, in useEffect):
- Default state: a small crimson circle (12px diameter, #E8001D, no fill, 1px border)
- Hover state over links/buttons: expands to 40px, fills with crimson at 20% opacity, shows "VIEW" label in 8px white uppercase Helvetica inside
- Magnetic effect on all <button> and <a> elements: the cursor gently pulls toward them within a 60px radius using lerped position
- Disable on touch devices (pointer: coarse)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3 — NAVIGATION (NAV)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Fixed, fullwidth nav bar. On initial load: transparent with white logo and links. On scroll past 60px: a glassmorphism bar appears (background: rgba(10,10,10,0.7), backdrop-filter: blur(20px), border-bottom: 1px solid rgba(255,255,255,0.08)).

Left: LBB logotype — bold condensed uppercase, crimson red, 28px, weight 900. No image, pure CSS/text.
Center: Links — SHOP / HOODIES / PANTS / SNEAKERS / ABOUT
Right: Cart icon (outline) + "NEW DROP" pill button (crimson fill, white text, 11px uppercase, 4px border-radius, hover: white fill + crimson text)

On mobile (< 768px): hamburger icon top-right. Tap opens a fullscreen overlay menu (black background, links stacked vertically, 48px, white, appear with staggered GSAP fadeInUp with 80ms delay between each).

Semantic HTML: <nav role="navigation" aria-label="Main navigation">. Each link is a real <a> tag. The active route link gets aria-current="page".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4 — HERO SECTION (THE SHOWSTOPPER)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

100vh fullscreen. Black background. This is the most important section — make it extraordinary.

4a. THREE.JS SCENE (lazy-loaded, client-only):
  - Use React Three Fiber + @react-three/drei
  - Render a placeholder 3D sneaker shape (use a BoxGeometry or CapsuleGeometry combo approximating a shoe silhouette, or a placeholder GLB sphere at 0.5 opacity) with:
    - MeshStandardMaterial with roughness: 0.2, metalness: 0.1, color: #E8001D
    - Environment preset "city" from @react-three/drei for realistic reflections
    - ContactShadows underneath (opacity 0.4, blur 2)
    - Soft ambient light + one directional light from top-right
    - Auto-rotate slowly (0.003 rad/frame on Y axis)
    - OrbitControls enabled (mouse drag to rotate 360°, enableZoom: false, enablePan: false)
    - The 3D canvas: position absolute, fills the full hero, pointer-events: none except on the model itself
    - Comment clearly: "// Replace this geometry with your real .glb sneaker/hoodie model via useGLTF"
  - PERFORMANCE: Use Suspense with a fallback (black div). On mobile (window.innerWidth < 768), render a static CSS gradient background instead of the 3D canvas — no Three.js on mobile for perf reasons.

4b. HERO TEXT LAYER (above the canvas, z-index: 10):
  - Position: centered vertically + horizontally via absolute positioning
  - Top eyebrow label: "NEW COLLECTION 2026" — 10px uppercase, letter-spacing: 0.3em, white, opacity: 0.5
  - Main headline (h1): "LBB" — massive, 22vw font-size, font-weight: 900, color: white, line-height: 0.85, letter-spacing: -0.04em. The letters should feel like they own the screen.
  - Below headline: a thin 1px crimson horizontal rule (width: 80px), then a subtitle in 14px white 60% opacity: "Premium Iranian Streetwear"
  - Two CTAs side by side:
    - "SHOP NOW" → filled crimson button, 13px uppercase, weight 700, letter-spacing: 0.15em, 48px height, 32px horizontal padding
    - "SEE LOOKBOOK" → ghost button (1px white border, transparent fill), same sizing
    - Both: hover transitions 200ms ease, transform: translateY(-2px) on hover

4c. SCROLL INDICATOR:
  - Bottom-center of hero: a thin white vertical line (1px × 48px) that pulses (CSS keyframe: opacity 1→0.2→1, 1.5s infinite) + "SCROLL" text in 9px uppercase white below it

4d. HERO ENTRANCE ANIMATION (GSAP, client-only):
  On page load, staggered timeline:
  - t=0: eyebrow fades in from bottom (y: 20px → 0, opacity: 0→1, duration: 0.6s)
  - t=0.15: "LBB" letters animate in one by one (split by character, each: y: 60px → 0, opacity: 0→1, 0.4s, stagger: 0.08s)
  - t=0.6: subtitle + rule fade in
  - t=0.8: CTA buttons fade in from bottom
  - t=1.0: 3D canvas fades in (opacity 0 → 1, 0.8s)
  - t=1.2: scroll indicator appears

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 5 — MARQUEE STRIP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Immediately after the hero. Full width. Black background.
A horizontally scrolling infinite marquee (CSS animation, no JS library):
Content repeats: "LBB ✦ STREETWEAR ✦ HOODIES ✦ SNEAKERS ✦ NEW DROP ✦ PANTS ✦ LBB ✦"
Style: 11px uppercase, letter-spacing: 0.3em, white, opacity 0.35. Speed: 30s linear infinite.
Separator: ✦ symbol in crimson (#E8001D).
Thin 1px crimson lines border it top and bottom.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 6 — FEATURED CATEGORIES (SCROLL-DRIVEN)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Black background section. 5 category tiles rendered as a horizontal row on desktop, stacked on mobile.
Categories: HOODIES / PANTS / T-SHIRTS / SNEAKERS / ACCESSORIES

Each tile:
- Tall card (aspect-ratio 3/4), black background
- Top area: a large category number (01, 02, 03...) in 72px, weight 900, crimson, positioned top-left
- Center: category name in 18px uppercase white, weight 700
- Bottom: item count e.g. "24 PIECES" in 10px white opacity 0.4
- Border: 1px solid rgba(255,255,255,0.08)
- Border-radius: 4px
- Hover state (200ms transition):
  - border-color changes to crimson
  - category number color: white
  - card lifts: transform: translateY(-8px), box-shadow: 0 20px 60px rgba(232,0,29,0.2)
  - A thin crimson bottom border (4px) slides in from left using pseudo-element

GSAP ScrollTrigger entrance: when section enters viewport, cards stagger in from below (y: 80px → 0, opacity: 0→1, stagger: 0.1s, ease: power3.out).

Semantic: 

Shop By Category

 (visually hide h2 with sr-only class if needed for design).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 7 — FEATURED PRODUCTS (3D HOVER REVEAL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Title: "NEW ARRIVALS" — 56px, weight 900, white, left-aligned with "— 2026" suffix in crimson on same line.

A 2×2 grid of product cards on desktop (1 col mobile), large square cards:

Each product card:
- Black background, 1px border rgba(255,255,255,0.06)
- Image area (top 70%): black with a large placeholder gradient (diagonal crimson to black) — leave comment: "// Replace with actual product image "
- Bottom strip: product name (14px, white, weight 600), price in Tomans (12px, crimson), category tag (10px, white opacity 0.4)
- "ADD TO CART" ghost button appears on hover with a smooth slide-up from bottom

3D TILT EFFECT (client-only, CSS transforms):
Each card should have a mouse-tracking 3D tilt effect — on mousemove over the card, calculate the mouse position relative to card center and apply:
  transform: perspective(1000px) rotateX(Ydeg) rotateY(Xdeg)
Max tilt: 8 degrees. Smooth: use CSS transition: transform 0.1s ease when mouse moves, 0.4s ease on mouseleave to reset.
Add a subtle gloss highlight div that follows the mouse (radial gradient, white 8% opacity) as a shine layer.

Sample product data (hardcoded for now, to be replaced by CMS/Supabase later):
1. "LBB Classic Hoodie" — 1,850,000 تومان — Hoodies
2. "Cargo Street Pants" — 1,250,000 تومان — Pants
3. "LBB Signature Tee" — 780,000 تومان — T-Shirts
4. "Urban Runner Sneaker" — 2,400,000 تومان — Sneakers

GSAP ScrollTrigger: cards stagger in from bottom when scrolled into view.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 8 — BRAND MANIFESTO (FULL-SCREEN STATEMENT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full viewport height section. Background: deep crimson (#E8001D).

A single massive typographic statement, centered:
Line 1: "NOT JUST" — 8vw, weight 900, white, letter-spacing: -0.03em
Line 2: "CLOTHES." — 12vw, weight 900, white, letter-spacing: -0.04em, line-height: 0.85
Line 3 (below): "A STATEMENT." — 8vw, weight 900, white opacity 0.4

Small copy bottom-right corner: "Est. LBB ✦ Tehran" — 10px uppercase, white opacity 0.5

GSAP ScrollTrigger pin: this section stays pinned for 0.5 scroll length. As user scrolls INTO it, the text scales from 0.85 → 1.0 (scale transform). As they scroll OUT, it fades out slowly.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 9 — INSTAGRAM / SOCIAL PROOF STRIP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Black background. Title: "@lbbclo" in 13px uppercase, letter-spacing: 0.25em, white opacity 0.5, centered.

Below: 5 square cells in a horizontal row (scroll horizontally on mobile). Each cell:
- Black background with a diagonal gradient placeholder (crimson → black, 135deg)
- Overlay: crimson ✦ icon, centered, appears on hover
- Border: 1px solid rgba(255,255,255,0.06)
- Border-radius: 2px
- Clicking any cell: opens https://www.instagram.com/lbbclo in new tab

Below row: "FOLLOW US ON INSTAGRAM" → outlined button, 12px uppercase white, border: 1px solid white opacity 0.3, hover: border turns crimson.

This section has no real images (placeholder only). Comment: "// Connect to Instagram Basic Display API or replace with real UGC images."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 10 — FOOTER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Black background, top 1px solid rgba(255,255,255,0.08).
4-column grid (2 cols on tablet, 1 col on mobile):
- Col 1: LBB logotype (same as nav, 24px), + 2-line brand description in 12px white opacity 0.4 + Instagram icon linking to @lbbclo
- Col 2: SHOP (links: Hoodies, Pants, T-Shirts, Sneakers, Accessories)
- Col 3: INFO (About, Contact, Size Guide, Shipping & Returns)
- Col 4: "JOIN THE COMMUNITY" — small email input (dark bg, 1px white border) + "SUBSCRIBE" ghost button

Bottom bar: "© 2026 LBB — All rights reserved" left, "Designed for the streets of Tehran" right — both 10px, white opacity 0.25.

Semantic: 

, all links are real  tags.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 11 — GLOBAL DESIGN TOKENS & PERFORMANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CSS variables (define in :root):
  --color-red:    #E8001D
  --color-black:  #0A0A0A
  --color-white:  #FFFFFF
  --color-glass:  rgba(10, 10, 10, 0.7)
  --font-display: "Bebas Neue", "Arial Black", sans-serif   /* for headlines */
  --font-body:    "Inter", "Helvetica Neue", sans-serif     /* for body/UI */
  --radius-sm:    4px
  --radius-md:    8px
  --transition:   200ms ease

Load Bebas Neue and Inter from Google Fonts. Use font-display: swap.

PERFORMANCE rules (non-negotiable):
1. All Three.js / R3F imports: lazy(() => import(...)) — only load when scrolled into view using IntersectionObserver
2. All product images: loading="lazy", width + height attributes set (prevent CLS)
3. GSAP + ScrollTrigger: dynamic import, only after DOM is ready
4. All window/document access: inside useEffect or typeof window !== 'undefined' guards (SSR safety)
5. Reduced motion: wrap ALL GSAP animations in if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
6. No unused CSS — use Tailwind purge or minimal custom CSS only

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 12 — ACCESSIBILITY BASELINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- One 

 per page: the "LBB" hero headline
- Heading hierarchy: h1 → h2 (New Arrivals, Shop By Category) → h3 (product names)
- All interactive elements: keyboard focusable, visible focus ring (outline: 2px solid #E8001D, outline-offset: 2px)
- All images: descriptive alt text in English AND Persian where relevant. Example: alt="LBB Classic Hoodie — Red streetwear hoodie with embroidered logo"
- Color contrast: all text meets WCAG AA (white on black passes; white on crimson: check and adjust opacity where needed)
- Skip-to-content link: Skip to content as the very first element in 

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 13 — FILE STRUCTURE (guide for AI)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Organize as:
  /app/routes/index.tsx         ← Homepage route (SSR, exports loader for meta tags)
  /app/routes/sitemap.xml.tsx   ← Sitemap route
  /app/routes/robots.txt.tsx    ← Robots route
  /app/components/
    Navbar.tsx
    Hero3D.tsx                  ← Three.js scene (client-only, lazy)
    CustomCursor.tsx            ← Cursor logic (client-only)
    CategoryGrid.tsx
    ProductCard.tsx             ← With tilt effect
    Marquee.tsx
    Manifesto.tsx
    InstagramStrip.tsx
    Footer.tsx
  /app/lib/
    products.ts                 ← Product data type + mock data
    seo.ts                      ← Helper to generate meta tag objects per route
  /app/styles/
    globals.css                 ← CSS variables, reset, font imports

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FINAL NOTES FOR LOVABLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After generating, run the built-in SEO Discoverability Audit (Settings → Discoverability) and fix any flagged issues around meta tags, heading hierarchy, alt text, or robots.

The final result should feel like a fusion of:
- The editorial boldness of SSENSE
- The immersive 3D presence of KidSuper World
- The crisp typographic power of Supreme
- The scroll storytelling of a Cartier campaign
...but uniquely LBB — raw, Iranian, streetwise, and unapologetically red.
```

---

## نکات قبل از پیست‌کردن:

| موضوع | توضیح |
|---|---|
| **پروژه جدید** | حتماً یه پروژه‌ی fresh در Lovable باز کن (بعد از می ۱۳ ۲۰۲۶) تا TanStack Start + SSR بگیری |
| **مدل سه‌بعدی** | پرامت یه placeholder geometry داره؛ مدل واقعی کتونی/هودی رو باید جداگانه export کنی به GLB و بدی به Lovable بعداً |
| **عکس محصولات** | فعلاً placeholder gradient هست؛ عکس‌های واقعی رو از اینستا بگیر یا عکاسی محصول کن |
| **فونت Bebas Neue** | رایگانه روی Google Fonts؛ Lovable خودکار لودش می‌کنه |
| **فاز بعد** | بعد از تأیید هومپیج، یه پرامت جداگانه برای صفحه Shop و ProductDetail می‌زنیم |

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8966f8ea-38d1-4cff-b44e-86532c4dc299).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
