# Shared blog assets

Place images/diagrams used across multiple posts in `src/content/blog/shared/`.

Reference from content using relative paths from the post folder, for example (from `src/content/blog/<slug>/index.mdoc`):

```md
![Grid legend](../shared/grid-legend.svg)
```

Benefits:

- Assets live alongside blog content and are processed by Astro/Vite (transform, compress, fingerprint).
- Authors can use relative paths from posts, just like post-scoped assets.

Notes:

- Use SVG for diagrams when possible; AVIF/WEBP for photos/exports; PNG for screenshots.
- If you truly need a stable, unprocessed URL (e.g. a CDN URL or published asset that must not be changed or fingerprinted), keep it in `public/` and reference it with an absolute path, but be aware it won't be optimized by Astro.
