# System Patterns: Personal Website (kadykov.com)

This document outlines key architectural patterns, technical decisions, and component relationships within the kadykov.com website.

## 1. Image Optimization and Delivery
-   **Core Technology**: `astro:assets` module (`getImage`, `inferRemoteSize`) is used for processing and generating image sources.
-   **Format Prioritization**:
    *   **Primary**: AVIF format is served for modern browsers due to its superior compression and quality.
    *   **Fallback**: JPEG format is used as a fallback for browsers that do not support AVIF. The fallback JPEG is intentionally served at a minimal resolution, assuming devices not supporting AVIF may have lower hardware capabilities. (Note: For thumbnails, the fallback JPEG from `OptimizedImage.astro` is based on `displayWidth`).
-   **Source**: Images are referenced from a remote source (e.g., Flickr, `share.kadykov.com`).
-   **Lightbox Integration**: The `PhotoSwipe.astro` component generates `data-pswp-srcset`, `data-pswp-width`, and `data-pswp-height` attributes for PhotoSwipe, using the AVIF image set. (Note: `PhotoGallery.astro` now directly prepares these attributes for PhotoSwipe JS).
-   **Original Image Link**: A direct link to the original source image (e.g., on Flickr or `share.kadykov.com`) is provided (`<a href={src} ...>`).
-   **Implementation Example**: See `src/components/PhotoSwipe.astro` (for lightbox setup) and `src/components/PhotoGallery.astro` (for gallery item setup).
-   **Reusable Optimized Image Component (`src/components/OptimizedImage.astro` - Implemented & Refined)**:
    *   **Goal**: Centralizes logic for rendering optimized images using `astro:assets` (`getImage`, `inferRemoteSize`) and `src/utils/widthSet.ts`.
    *   **Props**: `src`, `alt`, `displayWidth`, `sizesAttr`, `maxScaling` (default 3), `class` (for `<picture>`), `imgClass` (for `<img>`), `loading`, `decoding`, `quality`, `enforceAspectRatio`.
    *   **Logic**:
        *   Uses `inferRemoteSize` to get `fullWidth` and `fullHeight` of the remote image.
        *   Calculates `currentWidthSet` by filtering global `widthSet` based on `fullWidth`, `displayWidth`, and `maxScaling`.
        *   Calculates `displayHeight` if `enforceAspectRatio` is provided by the consumer.
        *   Calculates `heightForFallback` for the `<img>` tag, using `displayHeight` if available, otherwise deriving from intrinsic aspect ratio and `displayWidth`. This ensures `getImage` receives explicit dimensions for CLS prevention with remote images.
        *   The root `<picture>` tag does *not* apply a `max-width` style, allowing parent containers to control its rendered size. It applies `aspect-ratio` style if `enforceAspectRatio` is used.
        *   The `class` prop is applied to the `<picture>` tag. For proper filling of containers like `figure` in cards, it's expected to be used with `block w-full` (or similar).
    *   **Output**: Uses `getImage` to generate sources for `avif`, `webp`, and a `jpeg` fallback, rendered within a `<picture>` element. The `<img>` tag uses `width` and `height` attributes derived from `fallbackImage.attributes`.
    *   **Primary Use Cases**: Blog post featured images (in `MarkDownPostLayout.astro`), blog post card thumbnails (in `BlogPost.astro`), and photo gallery thumbnails (in `PhotoGallery.astro`).

## 2. Photo Gallery System Architecture
-   **Thumbnail Display Component (`src/components/PhotoGallery.astro`):**
    *   Responsible for fetching and processing photo manifest data (e.g., from `image_manifest.json`).
    *   Iterates through photos, preparing data for both thumbnail display and lightbox integration.
    *   Uses `src/components/OptimizedImage.astro` for rendering individual responsive thumbnails.
    *   Manages the overall layout of thumbnails (e.g., using Tailwind CSS Columns for a masonry effect).
    *   Provides necessary `data-pswp-*` attributes (e.g., `data-pswp-src`, `data-pswp-srcset`, `data-pswp-width`, `data-pswp-height`) on anchor tags, which PhotoSwipe JavaScript uses to initialize the lightbox.
-   **Optimized Thumbnails (`src/components/OptimizedImage.astro`):**
    *   Acts as a dedicated component for generating responsive `<picture>` elements with optimized AVIF, WebP, and JPEG sources, as detailed in section 1.
    *   Receives props like `src`, `alt`, `displayWidth`, `sizesAttr` from `PhotoGallery.astro`.
-   **Lightbox Functionality:**
    *   Provided by the PhotoSwipe JavaScript library (`src/scripts/photoswipe.js`).
    *   Uses the `photoswipe-dynamic-caption-plugin` to display captions.
    *   The `PhotoGallery.astro` component embeds photo metadata (title, description, date, tags) as `data-*` attributes (e.g., `data-title`, `data-description`, `data-date`, `data-tags`) on the anchor tags.
    *   The `captionContent` function in `src/scripts/photoswipe.js` consumes these `data-*` attributes to dynamically build the caption HTML.
    *   Captions display the photo's title, description, date, and tags. Date and tags are clickable links to their respective archive pages (e.g., `/photos/dates/YYYY-MM-DD/1`, `/photos/tags/[tag]/1`).
    *   Styling for the caption is achieved by applying Tailwind CSS utility classes directly within the `captionHTML` generated in `photoswipe.js`, ensuring it harmonizes with the site's design and the plugin's dark background.
-   **Separation of Concerns:**
    *   `PhotoGallery.astro`: Handles gallery data, layout, and provisioning of all necessary `data-*` attributes for PhotoSwipe core and the caption plugin.
    *   `OptimizedImage.astro`: Focuses on generating the markup for a single optimized, responsive image.
    *   `photoswipe.js`: Manages the interactive lightbox experience.
-   **Potential Future Refinement:**
    *   Consideration for integrating `OptimizedImage.astro` logic more directly within a hypothetical enhanced `PhotoSwipe.astro` component if it were to also manage thumbnail generation, creating a more unified "gallery item" component. This approach was deferred for the current implementation phase.

## 3. Layout and Structure
-   **Main Layout**: `src/layouts/BaseLayout.astro` serves as the foundational layout for most pages.
    *   It includes common components: `Header.astro`, `Navigation.astro`, `Footer.astro`.
-   **Navigation**:
    *   A DaisyUI `drawer` component (`<body class="drawer drawer-end">`) is used for the primary navigation, typically for mobile/smaller screens.
    *   The `Header.astro` component is sticky (`position: sticky`) and implements an auto-hide behavior on scroll (hides on scroll down, appears on scroll up) via an inline JavaScript snippet in `BaseLayout.astro`.
-   **View Transitions**: Astro's View Transitions (`@view-transition { navigation: auto; }`) are enabled globally in `BaseLayout.astro` for smoother page transitions.

## 4. Styling and Theming
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

## 5. Font Management
-   **Self-Hosting**: Fonts (Ruda, Faustina, Source Code Pro) are self-hosted using `@fontsource-variable` packages.
-   **Preloading**: Specific WOFF2 font files (`ruda-latin-wght-normal.woff2`, `faustina-latin-wght-normal.woff2`) are preloaded in `src/layouts/BaseLayout.astro` for performance.
-   **`@font-face` Definitions**: Located in `src/styles/base.css`.
    *   Define `font-family` for "Ruda Variable", "Faustina Variable", and "Source Code Pro Variable".
    *   Include `latin` and `latin-ext` subsets for normal and (where applicable) italic styles.
    *   Specify `unicode-range` for each font file to aid browser optimization.
    *   `font-display: block;` is used.

## 6. Caching Strategy
-   **Netlify Headers**: Custom caching headers are defined in `public/_headers`.
-   **Asset Caching**: Files under `/_astro/*` (Astro's generated assets) are configured with:
    *   `cache-control: public`
    *   `cache-control: max-age=31536000` (1 year)
    *   `cache-control: immutable`
    This ensures long-term caching of versioned assets by browsers and CDNs.

## 7. Blog Content & Layout Patterns (Implemented & Refined)
-   **Content Source**: Markdown (`.md`) files in `src/content/blog/`. MDX for future complex posts.
-   **Schema**: Defined in `src/content/config.ts` (Zod). Includes `title`, `pubDate`, `description`, `image` (object with `url`, `alt`), `tags` (optional array), `lastUpdatedDate` (optional).
-   **URL Structure**: Posts are served at `/blog/[slug]` (e.g., `/blog/hello-world`), with no `.md` extension.
-   **Individual Post Rendering**:
    *   **Dynamic Route**: `src/pages/blog/[...slug].astro` uses `getCollection("blog")` and `entry.slug` for `getStaticPaths`.
    *   **Layout**: `src/layouts/MarkDownPostLayout.astro` is used. It displays metadata and uses `OptimizedImage.astro` for the featured image. Content is styled with `.prose-serif`. Semantic typography classes are used for layout elements.
-   **Listing Pages**:
    *   **Main Listing**: `src/pages/blog/index.astro` (serves `/blog/`).
    *   **Tag Listing**: `src/pages/tags/[tag].astro` (serves `/tags/[tag_name]/`).
    *   Both pages fetch posts using `getCollection("blog")` and display them as a grid of cards using the `BlogPost.astro` component.
    *   Page titles (`<h1>`) use the `text-heading-1` semantic class.
-   **Blog Post Card (`src/components/BlogPost.astro`)**:
    *   A DaisyUI card component.
    *   Displays: title (link), publication date, description snippet, thumbnail image (via `OptimizedImage.astro`), and tags.
    *   Uses semantic typography classes (e.g., `text-heading-3`, `text-body-standard-serif`, `text-meta`).
    *   The image is contained within a `figure class="aspect-video"`. The `a` tag wrapping `OptimizedImage` and the `OptimizedImage`'s `class` prop are set to `block w-full` to ensure the image fills the figure and respects card corner rounding.
-   **RSS Feed**: `src/pages/rss.xml.js` uses `getCollection("blog")` and generates links to `/blog/[slug]`.
-   **Tag Handling**: `src/pages/tags/[tag].astro` correctly filters posts by tag (handling optional `tags` field) and links to `/blog/[slug]`.
