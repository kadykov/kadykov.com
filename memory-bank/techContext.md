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
    -   Currently uses `glob` loader in `src/content.config.ts` to source Markdown from `src/data/blog/`.
    -   Individual posts rendered using `await render(entry)` in dynamic route `src/pages/posts/[...id].astro`.
    -   **Planned Modernization**: Migrate to standard `src/content/blog/` directory structure (removing `glob` loader) and update rendering to use modern Astro APIs (e.g., `entry.render()` or direct `<Content />` component).

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

## 4. Build & Deployment
-   **Package Manager**: npm
-   **Build Command**: `npm run build` (which executes `astro check && astro build`).
-   **Output Directory**: `dist/` (configured in `netlify.toml`).
-   **Hosting**: Netlify.
    -   Configuration: `netlify.toml`.
    -   Custom Headers: `public/_headers` for caching `/_astro/*` assets.

## 5. Development Environment & Tooling
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
