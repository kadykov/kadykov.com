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
