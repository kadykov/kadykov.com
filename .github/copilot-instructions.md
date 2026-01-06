# Copilot Instructions for kadykov.com

This is an **Astro 5** personal website featuring a blog, photo galleries, and static pages. It uses Markdoc for content authoring and deploys to Netlify via GitHub Actions.

## Architecture Overview

### Content Collections

The site uses **Astro Content Collections** with a unique hybrid approach:

- **Local collections**: `blog/` and `pages/` (Markdown/Markdoc files in `src/content/`)
- **Remote collections**: `photos/` and `images/` (fetched from external JSON manifests at build time)

Remote collections use **loader functions** in [src/content.config.ts](src/content.config.ts) to fetch from `https://share.kadykov.com` (configurable via `PHOTO_SERVER_URL` env var). See [PHOTO_SERVER_CONFIG.md](PHOTO_SERVER_CONFIG.md).

### Image Optimization Strategy

**Critical**: All image optimization flows through [src/utils/imageOptimization.ts](src/utils/imageOptimization.ts) for cache reuse:

- Always use `inferSize: true` when source dimensions unknown
- Always use `layout: "constrained"` (default) for responsive images
- `maxWidth` parameter controls **CSS display width** (at 1x DPR), NOT source dimensions
- Generates 1x-4x DPR srcset automatically
- HTML `width`/`height` attributes are **CSS dimensions**, not source image dimensions

Components using this: `OptimizedImage`, `PhotoGallery`, `MarkdocImage`. Read [IMAGE_RENDERING_GUIDE.md](IMAGE_RENDERING_GUIDE.md) for the full mental model.

### Two-Layer Content Metadata

Content uses **descriptive** (SEO) and **visual** (engagement) metadata:

- `title` + `description`: For SEO, search results, RSS feeds
- `headline` + `subtitle`: For Hero sections and OpenGraph images (punchy, 3-7 words)

See [docs/content-metadata-guide.md](docs/content-metadata-guide.md) for guidelines and examples.

### Blog Asset Conventions

- **Per-post assets**: `src/content/blog/<slug>/index.mdoc` with co-located images
- **Shared assets**: `src/content/blog/shared/` for multi-post usage
- Use **relative paths** in Markdoc: `![](./diagram.svg)` or `![](../shared/icon.svg)`
- Avoid `public/` for blog assets (prevents Astro optimization)

Full details: [blog-assets-conventions.md](blog-assets-conventions.md)

## Key Workflows

### Development

```bash
just dev          # Start dev server (or npm run dev)
just build        # Build site (astro check + astro build)
just preview      # Preview production build
just validate     # Validate HTML in dist/
```

**Photo server config**: Create `.env` with `PHOTO_SERVER_URL=http://localhost:8000` to use local photo server instead of production.

### Working with Content

#### Adding a blog post

1. Create `src/content/blog/my-post-slug/index.mdoc`
2. Add frontmatter: `title`, `pubDate`, `description`, `tags`, optional `headline`/`subtitle`
3. Set `draft: true` to hide from listings/RSS during writing
4. Co-locate images in same directory, reference with `![](./image.png)`

#### Content is type-checked

Run `astro check` (part of `npm run build`) to validate all content against schemas.

### Custom Integrations

#### OpenGraph Image Generation

[src/integrations/opengraph/](src/integrations/opengraph/) runs **after build** to:

1. Scan `dist/` for HTML files
2. Extract metadata from HTML (title, description, type)
3. Generate OG images using Satori (React → PNG)
4. Write PNGs to `dist/og/`

Integration order matters: **opengraph must run before playformCompress** (see [astro.config.mjs](astro.config.mjs)).

#### Syntax Highlighting

Uses Shiki with custom transformer [src/config/shiki-transformers.mts](src/config/shiki-transformers.mts) to add copy buttons to code blocks. Configured in both `astro.config.mjs` and `markdoc.config.mjs`.

## Project Conventions

### Styling Philosophy

**Semantic HTML with minimal classes** — the CSS architecture prioritizes:

- **Semantic elements**: Use `<header>`, `<nav>`, `<article>`, `<section>` over `<div>`
- **Avoid meaningless elements**: No wrapper divs unless structurally necessary
- **Style elements directly**: Target HTML elements (`h2`, `article`, `time`) instead of classes
- **Context-aware styling**: Elements adapt based on their container (e.g., `article h2`, `nav a`)
- **OKLCH color system**: Entire design system uses OKLCH for perceptually uniform contrast calculations
- **Mathematical color derivation**: Only base OKLCH values defined; all variants auto-calculated

Example: `BlogPostListItem.astro` uses `<li><article><h2><a>` with zero styling classes — all styled via element selectors in [src/styles/base.css](src/styles/base.css).

**When classes ARE used**:

- **Functional requirements**: PhotoGallery grid classes for layout engine
- **External libraries**: PhotoSwipe, Natural Sticky state classes
- **Optional styling**: Pass-through `className` prop for consumer control

### File Organization

- **Components**: `src/components/*.astro` (presentational, reusable)
- **Layouts**: `src/layouts/*.astro` (page templates)
- **Utils**: `src/utils/*.ts` (shared logic, avoid duplication)
- **Config**: `src/config/*.ts` (centralized configuration)
- **Pages**: `src/pages/` (file-based routing)

### Markdoc Configuration

[markdoc.config.mjs](markdoc.config.mjs) customizes:

- `image` node → renders via `MarkdocImage.astro` for optimization
- `$photoServer` variable → accessible in content for dynamic URLs

### Draft Content

Set `draft: true` in frontmatter to exclude from:

- Blog listings and pagination
- Tag pages
- RSS feeds
- Site build (page won't be generated)

Filter in queries: `getCollection("blog", ({ data }) => data.draft !== true)`

## External Dependencies

- **Photo manifests**: `https://share.kadykov.com/photo_manifest.json` and `image_manifest.json`
- **Deployment**: GitHub Actions → Netlify (see [.github/DEPLOYMENT.md](.github/DEPLOYMENT.md))
- **Fonts**: Self-hosted via `@fontsource` packages (preloaded in [src/config/fontPreload.ts](src/config/fontPreload.ts))

## Common Patterns

### Querying collections

```typescript
import { getCollection } from "astro:content"

// Filter out drafts
const posts = await getCollection("blog", ({ data }) => data.draft !== true)

// Remote collection (photos)
const photos = await getCollection("photos")
```

### Using OptimizedImage

```astro
<OptimizedImage
  src={imageUrl}
  alt="Description"
  displayWidth={660}
  CSS
  width
  at
  1x
  DPR
  sizesAttr="(max-width: 768px) 100vw, 660px"
/>
```

### Accessing photo server URLs

```typescript
import { PHOTO_SERVER_URL, getImageUrl } from "./config/photoServer"

const fullUrl = getImageUrl(photo.data.relativePath)
```
