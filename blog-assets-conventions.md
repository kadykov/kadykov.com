# Blog assets conventions

## Goals

- Keep per‑post assets co‑located with the post for easy authoring and relative links.
- Provide a stable, shared bucket for images/diagrams used across multiple posts.
- Avoid accidental publishing of drafts; keep URLs stable after publish.

## Structure

1. Post‑scoped assets (preferred for single‑use)

- Location: `src/content/blog/<slug>/`
- File: `index.mdoc`
- Assets: `src/content/blog/<slug>/*` (png, jpg, avif, svg, etc.)
- Reference inside Markdoc with relative paths, e.g. `![alt](./diagram.svg)`

This lets Vite/Astro fingerprint and bundle assets alongside the post and keeps everything portable.

2. Shared assets (used by multiple posts)

- Location: `src/content/blog/shared/`
- Reference inside posts using relative paths, e.g. `![alt](../shared/grid-legend.svg)`

These live alongside the blog content so Astro/Vite can process and optimize them (transform, compress, and fingerprint). Keep filenames descriptive. If a stable, guaranteed-unprocessed URL is required (for example, a CDN URL you control), you can continue to use `public/` for that specific asset, but expect it will not be optimized by Astro.

Migration: If you already have assets under `public/assets/blog/shared/`, move them to `src/content/blog/shared/` and update any content references from absolute paths like `![alt](/assets/blog/shared/filename.svg)` to relative references like `![alt](../shared/filename.svg)`.

Docs note: Do not add documentation files (like READMEs) under `src/content/blog/shared/` because Astro will treat any files under `src/content/blog/` as blog posts and validate them against the blog schema. Instead, keep documentation in a repository-tracked docs folder such as `docs/`, or retain a simple README under `public/assets/blog/shared/` for compatibility/backwards compatibility. If you must include a doc under `src/content/blog/` that isn't an actual post, add the required frontmatter (title, pubDate, description, tags) and set `draft: true` so it won't be published. However, prefer putting docs outside of `src/content/`.

## Notes

- Slugs: the directory name under `src/content/blog/` becomes the post slug. `index.mdoc` is the entry file.
- Drafts: set `draft: true` in frontmatter to hide a post from listings, tags, and RSS; the page won’t be built.
- Media formats: prefer SVG for diagrams, AVIF/WEBP for photos/exports, and PNG for UI screenshots with sharp text.
- Accessibility: always include meaningful alt text; if decorative, use empty alt `![]()` intentionally.
- Performance: keep shared assets optimized; large originals can live outside the repo or in a `cache/` area.
