# Technical Context: Personal Website (kadykov.com)

This document details the technologies, tools, and configurations used in the kadykov.com website project.

## 1. Core Framework & Libraries
-   **Primary Framework**: AstroJS (`^5.7.10`)
    -   Site URL: `https://www.kadykov.com` (defined in `astro.config.mjs`)
-   **UI Styling**:
    -   Tailwind CSS (`^3.4.14` via `@astrojs/tailwind: ^6.0.2`)
    -   DaisyUI (`^5.0.9`, as a `devDependency`) for UI components.
    -   `@tailwindcss/typography` (`^0.5.15`) for styling Markdown/MDX content.
-   **Image Handling & Lightbox**:
    -   `astro:assets` for image processing.
    -   PhotoSwipe (`^5.4.4`) for image lightbox functionality.
    -   Allowed image domains: `kadykov.com`, `staticflickr.com` (HTTPS only).
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

## 2. AstroJS Integrations (from `astro.config.mjs` and `package.json`)
-   `@astrojs/tailwind`: Integrates Tailwind CSS. `applyBaseStyles` is `false`.
-   `astro-icon` (`^1.1.0`): For SVG icon management (e.g., `@iconify-json/ri: ^1.2.3` for Remix Icons).
-   `@astrojs/sitemap` (`^3.3.1`): Generates `sitemap-index.xml`.
-   `@astrojs/mdx` (`^4.2.6`): Enables MDX support for rich content pages.
-   `@playform/compress` (`^0.1.6`): Used for asset compression.
    -   `Image: false` (Astro's built-in asset handling is likely preferred for images).
    -   `HTML`: `html-minifier-terser` is used to minify HTML, removing comments.
-   `@astrojs/rss` (`^4.0.11`): For generating RSS feeds.

## 3. Font Management
-   **Source**: `@fontsource-variable/faustina` (`^5.1.0`), `@fontsource-variable/ruda` (`^5.2.5`), `@fontsource-variable/source-code-pro` (`^5.1.0`).
-   **Implementation**:
    -   Self-hosted WOFF2 variable font files.
    -   Specific files (`latin-wght-normal` for Ruda and Faustina) are preloaded in `src/layouts/BaseLayout.astro`.
    -   `@font-face` rules in `src/styles/base.css` define `Ruda Variable`, `Faustina Variable`, and `Source Code Pro Variable`.
    -   These rules include `latin` and `latin-ext` subsets for normal and italic styles (as applicable per font).
    -   `unicode-range` is specified for each font file.
    -   `font-display: block;` is used.

## 4. Typography System and Tailwind Customization (New Section)
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
