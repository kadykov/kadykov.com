# Technical Context: Personal Website (kadykov.com)

This document details the technologies, tools, and configurations used in the kadykov.com website project.

## 1. Core Framework & Libraries
-   **Primary Framework**: AstroJS (`^5.7.10`)
    -   Site URL: `https://www.kadykov.com` (defined in `astro.config.mjs`)
-   **UI Styling**:
    -   Tailwind CSS (`^3.4.14` via `@astrojs/tailwind: ^6.0.2`)
    -   DaisyUI (`^5.0.9`, as a `devDependency`) for UI components.
    -   `@tailwindcss/typography` (`^0.5.15`) for styling Markdown/MDX content.
    -   **Tailwind CSS `columns-*` for Masonry Layout:**
        *   Using Tailwind's `columns-*` utilities (e.g., `columns-2 sm:columns-3xs`) along with `gap-*` on the container and `break-inside-avoid` on child items provides an effective and simple way to achieve a responsive masonry-like photo gallery layout.
        *   Tailwind's named column widths (e.g., `columns-3xs`) might correspond to fixed CSS variable values (e.g., `var(--container-3xs)` which could be `16rem` or `256px`). This means the layout becomes "as many columns of X width as can fit" rather than a fixed number of columns. This understanding is crucial for `sizes` attributes.
    -   **Hover Effects, `overflow-hidden`, and `rounded-lg`:**
        *   To achieve a "zoom within frame" hover effect where a rounded image scales up but stays contained within its rounded parent:
            1.  **Parent element (e.g., `<a>` tag):** Apply `overflow-hidden`, `rounded-lg`, and the transform/transition classes for hover (e.g., `transition-transform duration-300 ease-in-out hover:scale-105`).
            2.  **Child image element (e.g., `<picture>` or `<img>`):** Must also have `rounded-lg` to ensure its own corners are rounded. It should fill the parent (e.g., `w-full h-full` or `w-full h-auto` if aspect ratio is maintained).
        *   If the hover effect requires the image to scale *beyond* the parent's original bounds, `overflow-hidden` must be removed from the parent. This makes achieving consistent rounded corners on the scaled element more challenging, as the scaled element itself must be perfectly rounded, and its non-rounded parts might otherwise become visible.
    -   **Tailwind `group` vs direct `hover`:**
        *   `group` on a parent and `group-hover:` on a child is useful if hovering the parent should affect multiple children or if the hoverable area is larger than the child to be affected.
        *   Direct `hover:` on an element is simpler if the element itself is the hover target and the effect target.
-   **Image Handling & Lightbox**:
    -   `astro:assets` for image processing (see Astro section for more details).
    -   PhotoSwipe (`^5.4.4`) for image lightbox functionality.
        *   **PhotoSwipe `data` Attributes for Lightbox Items:**
            *   `href` (on the `<a>` tag): Typically used by PhotoSwipe's default download functionality. Should point to the desired download URL (e.g., original full-resolution JPEG).
            *   `data-pswp-src`: Serves as the primary image source for PhotoSwipe if `srcset` is not supported or if PhotoSwipe is configured to use it. Can also be a fallback.
            *   `data-pswp-srcset`: Provides a `srcset` attribute for modern image formats (e.g., AVIF, WebP) and responsive sizes directly to PhotoSwipe.
            *   `data-pswp-width` / `data-pswp-height`: These attributes should specify the intrinsic dimensions of the image that `data-pswp-src` points to (or the largest image in the `srcset` if that's considered the primary representation). PhotoSwipe uses these for aspect ratio calculations, initial zoom, etc.
        *   **PhotoSwipe Download Behavior Customization:**
            *   If PhotoSwipe's download button doesn't use the `href` as expected (e.g., it seems to use `data-pswp-src`), the PhotoSwipe JavaScript initialization (`photoswipe.js` or similar) might be customized to determine the download URL differently.
            *   In this project, to ensure original JPEGs were downloaded, `data-pswp-src` was set to the original JPEG URL, as it appeared to influence the download behavior, while `data-pswp-srcset` provided AVIF for display.
    -   Allowed image domains: `kadykov.com`, `staticflickr.com`, `share.kadykov.com` (HTTPS only).
    -   **CSS `sizes` Attribute for Responsive Images (especially in Column Layouts):**
        *   The `sizes` attribute for `<img>` or `<source>` elements is critical for efficient responsive image loading. It must accurately describe the rendered width of the image across different viewport conditions.
        *   Example for a layout like `columns-2 sm:columns-3xs` (where `sm` is 680px and `3xs` implies columns of 256px width):
            `sizes="(min-width: 680px) 256px, 50vw"`
            This tells the browser:
            *   Above 680px viewport width, images are 256px wide.
            *   Below 680px viewport width (2 columns active), images are 50% of the viewport width.
-   **JavaScript Environment**:
    -   ES Modules (`"type": "module"` in `package.json`).
    -   TypeScript (`^5.5.3`) used for type checking via `astro check`.
-   **Content Collections (Blog Focus)**:
    *   **Directory Structure**: Blog content (Markdown files) resides in `src/content/blog/`.
    *   **Schema**: Defined in `src/content/config.ts` using Zod.
    *   **Rendering Individual Posts**:
        *   Dynamic route `src/pages/blog/[...slug].astro` handles rendering.
        *   Uses `getCollection("blog")` and `entry.slug` for path generation.
        *   Content is rendered using `entry.render()` and the `<Content />` component within `src/layouts/MarkDownPostLayout.astro`.
    *   **Listing Pages**:
        *   `src/pages/blog/index.astro` (main blog listing).
        *   `src/pages/tags/[tag].astro` (tag-specific listings).
        *   Both use `getCollection("blog")` to fetch posts and display them using `src/components/BlogPost.astro`.
    *   **RSS Feed**: `src/pages/rss.xml.js` uses `getCollection("blog")`.

## 2. AstroJS Specifics & Integrations
-   **Integrations (from `astro.config.mjs` and `package.json`):**
    -   `@astrojs/tailwind`: Integrates Tailwind CSS. `applyBaseStyles` is `false`.
    -   `astro-icon` (`^1.1.0`): For SVG icon management (e.g., `@iconify-json/ri: ^1.2.3` for Remix Icons).
    -   `@astrojs/sitemap` (`^3.3.1`): Generates `sitemap-index.xml`.
    -   `@astrojs/mdx` (`^4.2.6`): Enables MDX support for rich content pages.
    -   `@playform/compress` (`^0.1.6`): Used for asset compression.
        -   `Image: false` (Astro's built-in asset handling is likely preferred for images).
        -   `HTML`: `html-minifier-terser` is used to minify HTML, removing comments.
    -   `@astrojs/rss` (`^4.0.11`): For generating RSS feeds.
-   **Parser Quirks with JS in Template:**
    *   Complex JavaScript array methods (e.g., involving multiple chained calls like `.filter().concat().sort()`) directly within the template's `.map()` block can sometimes be misinterpreted by Astro's parser, especially if they contain characters like `<` that might be confused with JSX tags (e.g., `w <= value`).
    *   **Solution:** The most robust solution is to move such complex JavaScript logic into helper functions defined in the component's script section (`---` block). Simpler syntax changes (e.g., `value >= w`) might sometimes work but are less reliable.
-   **`astro:assets` Image Handling:**
    *   **`getImage` for Local Images:** When using `getImage` with local images (imported from `src`), Astro automatically infers dimensions. The `widths` parameter allows generating a `srcset` with multiple image sizes. `format` can be used to convert to different types (e.g., `avif`, `webp`).
    *   **`getImage` for Remote Images with `widths` (srcset):**
        *   When using `getImage` with the `widths` option (to generate a `srcset`) for remote image URLs, it is essential to also pass the `width` and `height` props. These should correspond to the intrinsic dimensions of the *original source* remote image.
        *   This allows `astro:assets` to correctly calculate the aspect ratio and corresponding heights for each width specified in the `widths` array.
        *   Failure to provide these for remote images when generating `srcset` can lead to `MissingImageDimension` errors during the build process.
    *   **`inferRemoteSize`:** Can be used to get dimensions of remote images if not known beforehand. Example: `const inferred = await inferRemoteSize(src); fullWidth = inferred.width; fullHeight = inferred.height;`
-   **Component Design Patterns (Example: `OptimizedImage.astro`):**
    *   The `OptimizedImage.astro` component demonstrates passing a `class` prop to its root `<picture>` element and an `imgClass` prop specifically to the inner `<img>` tag.
    *   It encapsulates logic for generating AVIF, WebP sources, and a fallback JPEG `<img>`, using `astro:assets`.

## 3. Font Management
-   **Source**: `@fontsource-variable/faustina` (`^5.1.0`), `@fontsource-variable/ruda` (`^5.2.5`), `@fontsource-variable/source-code-pro` (`^5.1.0`).
-   **Implementation**:
    -   Self-hosted WOFF2 variable font files.
    -   Specific files (`latin-wght-normal` for Ruda and Faustina) are preloaded in `src/layouts/BaseLayout.astro`.
    -   `@font-face` rules in `src/styles/base.css` define `Ruda Variable`, `Faustina Variable`, and `Source Code Pro Variable`.
    -   These rules include `latin` and `latin-ext` subsets for normal and italic styles (as applicable per font).
    -   `unicode-range` is specified for each font file.
    -   `font-display: block;` is used.

## 4. Typography System and Tailwind Customization
-   **Semantic Text Utilities:** A set of semantic utility classes (e.g., `.text-heading-1`, `.text-body-standard-serif`) are defined in `src/styles/base.css`. These classes encapsulate specific typographic styles (font family, size, weight, leading, margins, etc.) and serve as the "source of truth" for these styles across the site.
-   **Font Families (as per section 3):**
    -   Sans-serif: Ruda Variable (via `font-sans` in `tailwind.config.cjs`)
    -   Serif: Faustina Variable (via `font-serif` in `tailwind.config.cjs`)
    -   Monospace: Source Code Pro Variable (via `font-mono` in `tailwind.config.cjs`)
-   **Styling Standalone Elements:** Semantic text utilities are applied directly to HTML elements outside of Markdown content (e.g., titles, descriptions in Astro layouts like `MarkDownPostLayout.astro`).
-   **Styling Markdown (Prose) Content:**
    *   The `.prose-serif` utility class in `src/styles/base.css` is used to style Markdown content.
    *   It applies base Tailwind Typography styles (`@apply prose prose-lg sm:prose-xl;`) and responsive sizing.
    *   It sets base font families for the prose context (`@apply font-serif prose-headings:font-sans;`).
    *   **Key Pattern for Customization:** It then applies the pre-defined semantic text utility classes to specific prose elements using the `prose-modifier:component-class` syntax (e.g., `@apply prose-h1:text-heading-1;`, `@apply prose-p:text-body-standard-serif;`). This has proven to be an effective and clean method for customizing `@tailwindcss/typography` in this Astro project, allowing component-like classes (which themselves use `@apply`) to style prose elements. This was a key learning, as initial attempts with CSS nesting (`& h1 { @apply ... }`) or `tailwind.config.js` typography extensions were problematic or overly complex for this goal.
-   **Responsive Typography:** Semantic classes and prose styles incorporate responsive prefixes (e.g., `sm:text-xl`) to adjust typography for different screen sizes.
-   **DaisyUI for Links:** Link styling (`.text-link`) leverages DaisyUI's `link` and `link-hover` utilities, applied both directly and via `prose-a:text-link`.

## 5. Build & Deployment
-   **Package Manager**: npm
-   **Build Command**: `npm run build` (which executes `astro check && astro build`).
-   **Output Directory**: `dist/` (configured in `netlify.toml`).
-   **Hosting**: Netlify.
    -   Configuration: `netlify.toml`.
    -   Custom Headers: `public/_headers` for caching `/_astro/*` assets.

## 6. Development Environment & Tooling
-   **Code Formatting**:
    -   Prettier (`^3.3.3`)
    -   `prettier-plugin-astro` (`^0.14.1`)
    -   `prettier-plugin-tailwindcss` (`^0.6.8`)
    -   Format script: `npm run format` (runs `prettier --write .`).
-   **Pre-commit Hooks**: Currently uses Python-based pre-commit hooks (as per user information, defined in `.pre-commit-config.yaml`). User is considering switching to Husky.
-   **Dev Container**: Alpine-based devcontainer (user mentioned issues with Vite server access on host, now potentially resolvable, considering switch to Ubuntu/Debian-based).
-   **Theme Switching Package**: `theme-change` (`^2.5.0`).
-   **Linting**: No ESLint currently implemented (user idea).
-   **Testing**: No automated tests currently implemented (user idea).
-   **CI/CD**: No CI/CD pipeline set up (user idea).
-   **Task Runner**: No `justfile` or similar task runner (user idea).
-   **Iterative Debugging for CSS:** Complex CSS interactions (like hover effects, overflow, and border-radius) often require iterative trial and error, and careful inspection of applied styles and element hierarchy in browser developer tools. This was particularly relevant for achieving the thumbnail hover effects in the photo gallery.
