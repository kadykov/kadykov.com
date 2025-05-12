# System Patterns: Personal Website (kadykov.com)

This document outlines key architectural patterns, technical decisions, and component relationships within the kadykov.com website.

## 1. Image Optimization and Delivery
-   **Core Technology**: `astro:assets` module (`getImage`, `inferRemoteSize`) is used for processing and generating image sources.
-   **Format Prioritization**:
    *   **Primary**: AVIF format is served for modern browsers due to its superior compression and quality.
    *   **Fallback**: JPEG format is used as a fallback for browsers that do not support AVIF. The fallback JPEG is intentionally served at a minimal resolution, assuming devices not supporting AVIF may have lower hardware capabilities.
-   **Source**: Images are referenced from a remote source (e.g., Flickr, as indicated by `staticflickr.com` in `astro.config.mjs` image domains).
-   **Lightbox Integration**: The `PhotoSwipe.astro` component generates `data-pswp-srcset`, `data-pswp-width`, and `data-pswp-height` attributes for PhotoSwipe, using the AVIF image set.
-   **Original Image Link**: A direct link to the original source image (e.g., on Flickr) is provided (`<a href={src} ...>`).
-   **Implementation Example**: See `src/components/PhotoSwipe.astro`.
-   **Reusable Optimized Image Component (`src/components/OptimizedImage.astro` - Planned)**:
    *   **Goal**: Centralize logic for rendering optimized images using `astro:assets`, the `<Picture />` component, and `src/utils/widthSet.ts`.
    *   **Props**: `src`, `alt`, `displayWidth`, `sizesAttr`, `maxScaling` (default 3), `class`, `loading`, `decoding`, `quality`, `enforceAspectRatio`.
    *   **Logic**:
        *   Calculates `currentWidthSet` by filtering global `widthSet` based on `fullWidth` (from `inferRemoteSize`), `displayWidth`, and `maxScaling`. This aims to cap generated image sizes appropriately for general content.
        *   Calculates `displayHeight` if `enforceAspectRatio` is provided.
    *   **Output**: Uses Astro's `<Picture />` component to serve images in `avif`, `webp` formats with a `jpeg` fallback.
    *   **Primary Use Case**: Initially for blog post featured images, then for other content images across the site.
    *   **Future Enhancements (Deferred)**: Per-format scaling factors, option to disable `maxScaling` (e.g., for PhotoSwipe integration).

## 2. Layout and Structure
-   **Main Layout**: `src/layouts/BaseLayout.astro` serves as the foundational layout for most pages.
    *   It includes common components: `Header.astro`, `Navigation.astro`, `Footer.astro`.
-   **Navigation**:
    *   A DaisyUI `drawer` component (`<body class="drawer drawer-end">`) is used for the primary navigation, typically for mobile/smaller screens.
    *   The `Header.astro` component is sticky (`position: sticky`) and implements an auto-hide behavior on scroll (hides on scroll down, appears on scroll up) via an inline JavaScript snippet in `BaseLayout.astro`.
-   **View Transitions**: Astro's View Transitions (`@view-transition { navigation: auto; }`) are enabled globally in `BaseLayout.astro` for smoother page transitions.

## 3. Styling and Theming
-   **CSS Framework**: Tailwind CSS is the primary styling utility.
    *   Configuration: `tailwind.config.cjs`.
    *   Base Styles: Tailwind's base, components, and utilities are imported in `src/styles/base.css`. Astro's default base styles are disabled (`applyBaseStyles: false` in `astro.config.mjs`).
-   **UI Components**: DaisyUI is used for pre-styled components.
    *   Themes: Custom `light` and `dark` themes are defined in `tailwind.config.cjs`.
-   **Theme Switching**:
    *   An inline JavaScript snippet in `src/layouts/BaseLayout.astro` handles initial theme application.
    *   It checks `localStorage` for a user-persisted theme.
    *   If not found, it respects the `(prefers-color-scheme: dark)` media query.
    *   Defaults to 'light'.
    *   The chosen theme is applied by setting the `data-theme` attribute on the `<html>` element.
    *   The `theme-change` npm package is a dependency, likely used within a UI component (e.g., `ThemeSwitch.astro`) to allow user-driven theme changes that update `localStorage`.
-   **Typography Styling**:
    *   A custom Tailwind utility class `.prose-serif` (defined in `src/styles/base.css`) is used to style Markdown-generated content.
    *   It applies `font-serif` (Faustina) to body text and `font-sans` (Ruda) to headings within the prose context, along with other typographic refinements.

## 4. Font Management
-   **Self-Hosting**: Fonts (Ruda, Faustina, Source Code Pro) are self-hosted using `@fontsource-variable` packages.
-   **Preloading**: Specific WOFF2 font files (`ruda-latin-wght-normal.woff2`, `faustina-latin-wght-normal.woff2`) are preloaded in `src/layouts/BaseLayout.astro` for performance.
-   **`@font-face` Definitions**: Located in `src/styles/base.css`.
    *   Define `font-family` for "Ruda Variable", "Faustina Variable", and "Source Code Pro Variable".
    *   Include `latin` and `latin-ext` subsets for normal and (where applicable) italic styles.
    *   Specify `unicode-range` for each font file to aid browser optimization.
    *   `font-display: block;` is used.

## 5. Caching Strategy
-   **Netlify Headers**: Custom caching headers are defined in `public/_headers`.
-   **Asset Caching**: Files under `/_astro/*` (Astro's generated assets) are configured with:
    *   `cache-control: public`
    *   `cache-control: max-age=31536000` (1 year)
    *   `cache-control: immutable`
    This ensures long-term caching of versioned assets by browsers and CDNs.

## 6. Blog Content & Layout Patterns (Planned)
-   **Content Source**: Markdown (`.md`) files will be primary, located in `src/content/blog/`. MDX (`.mdx`) will be used for posts requiring complex layouts or custom components (e.g., inline PhotoSwipe).
-   **Schema**: Defined in `src/content.config.ts` using Zod. Key fields include `title`, `pubDate`, `description`, `image`, `tags`, and an optional `lastUpdatedDate`.
-   **Individual Post Layout (`src/layouts/MarkDownPostLayout.astro`)**:
    *   Will be the default for Markdown posts.
    *   Displays metadata (title, dates, description, image) with distinct styling.
    *   The main post content (from the `<slot />`) will be wrapped in a `div` with the `.prose-serif` class for consistent typography.
-   **Listing Page (`src/pages/blog.astro`)**:
    *   Will display a list of posts using an enhanced component (e.g., `BlogCard.astro`) showing title, date, description snippet, thumbnail image, and tags.
-   **Tagging**:
    *   Tags will be displayed on individual posts and listing previews.
    *   Dedicated pages for listing all posts under a specific tag (`src/pages/tags/[tag].astro`) and an index of all tags (`src/pages/tags/index.astro`) will be implemented.
-   **Rendering**:
    *   Dynamic route `src/pages/posts/[...id].astro` will use modern Astro APIs (e.g., `entry.render()`) for rendering content.
