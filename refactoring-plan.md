# Website Refactoring and Development Plan

This document outlines the strategic plan for refactoring and enhancing kadykov.com. The primary goal is to complete the migration from Tailwind CSS to a custom semantic CSS implementation while improving site structure, features, and content strategy.

## Phase 1: Complete the Semantic CSS Foundation

This phase focuses on finishing the core migration and establishing a solid, consistent styling foundation.

- **Task 1.1: Finalize the Color System.**

  - [x] Decide on a primary color palette (e.g., 4-5 base colors).
  - [x] Define CSS variables for these base colors in `src/styles/base.css`.
  - [x] Derive other colors (e.g., muted, hover, component-specific) from the base colors, potentially using CSS `calc()` or `hsl()` functions to ensure consistency.
  - [ ] Create distinct styles for inline text links vs. standalone buttons to resolve the transparent `hover` color issue.
  - [x] Apply the new color system consistently across `light` and `dark` themes.

- **Task 1.2: Refactor the Hero Layout.**

  - [ ] Modify `src/layouts/HeroLayout.astro` and `src/layouts/HeroArticleLayout.astro`.
  - [ ] Replace the `<hgroup>` element with a more flexible structure, such as a `<header>` within the `<main>` content, to allow for additional elements like tags or dates.

- **Task 1.3: Redesign Core Pages with Semantic CSS.**

  - [ ] Redesign the photo gallery pages (`src/pages/photos/[page].astro`, `src/pages/photos/tags/[tag]/[page].astro`, etc.) to use the new semantic CSS, removing Tailwind dependencies.
  - [ ] Ensure the PhotoSwipe lightbox remains fully functional and is styled consistently with the new theme.

- **Task 1.4: Standardize Blog Post Image Styling.**
  - [ ] Adjust the CSS in `src/styles/base.css` to constrain images within blog posts (`.prose img`, `figure`) to the content width (`--max-w-body`).
  - [ ] Defer implementing a lightbox for inline images to a later phase to keep this focused.

## Phase 2: Enhance Core Components & Layouts

With the foundation in place, this phase focuses on creating more advanced, reusable components and improving key pages.

- **Task 2.1: Develop an Advanced Hero Component.**

  - [ ] Create a new, reusable Hero component (e.g., `src/components/AdvancedHero.astro`).
  - [ ] This component should support a two-column layout (image on one side, text on the other) on wider screens, stacking to a single column on mobile.
  - [ ] Integrate this new hero into the Home ([`src/pages/index.mdx`](src/pages/index.mdx)), About ([`src/pages/about.mdx`](src/pages/about.mdx)), and Contact pages.

- **Task 2.2: Refactor and Enhance the CV Page.**

  - [ ] Rewrite the content of `src/pages/cv.md` to be more web-native and detailed than the PDF version.
  - [ ] Consider using MDX or a dedicated Astro component to structure the CV with more interactive elements (e.g., timelines, expandable sections).

- **Task 2.3: Improve the `OptimizedImage` Component.**
  - [ ] Analyze the `srcset` output.
  - [ ] Evaluate dropping the JPEG fallback if WebP is sufficient for all targeted non-AVIF browsers. This would simplify the generated markup.

## Phase 3: Content Strategy & Blog Development

This phase focuses on establishing a workflow for creating and publishing content.

- **Task 3.1: Define a Content Drafting Workflow.**

  - [ ] Adopt a "feature branch" strategy for new blog posts. Create a new branch for each article, write and revise it there, and merge to `main` only when it's ready for publication.
  - [ ] Add a `draft: true` property to the blog collection schema in `src/content/config.ts`. Filter out draft posts during the build process so they don't appear on the live site.

- **Task 3.2: Implement Curated Photo Galleries.**

  - [ ] Create the first curated gallery using an MDX file (e.g., `src/pages/galleries/my-first-gallery.mdx`).
  - [ ] In the MDX file, use inline styles or a `<style>` tag to override CSS color variables to give the gallery a unique theme.
  - [ ] Use the existing `PhotoGallery.astro` component, passing a filtered list of photos.

- **Task 3.3: Publish Initial Content.**
  - [ ] Decide on the format for the "Tab Management Manifesto" and "Email Management Manifesto" (e.g., blog posts, dedicated pages).
  - [ ] Create and publish the first pieces of content using the new workflow.

## Phase 4: Future Development & Polish (Long-term)

These are tasks to consider after the core refactoring and content strategy are in place.

- [ ] **Expand Semantic CSS Framework**: Add styles for more UI elements (toggles, switches, forms, tables) to make it more complete.
- [ ] **Blog Enhancements**: Implement a table of contents for blog posts, potentially in a sidebar layout.
- [ ] **Photo Gallery Lightbox**: Add a lightbox solution for images within blog posts.
- [ ] **CI/CD & Tooling**: Set up a CI/CD pipeline with GitHub Actions or GitLab CI/CD for automated checks and deployments.
- [ ] **Documentation**: Document the custom semantic CSS framework, explaining the required HTML structure for proper styling.

This plan provides a clear path forward. We can track progress by checking off tasks as we complete them.
