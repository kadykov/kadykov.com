# Project Progress: Personal Website (kadykov.com)

This document tracks the development progress, current status, and known issues for the kadykov.com website.

## 1. Current Overall Status
-   **Date**: 2025-06-06
-   **Phase**: General Photo Gallery Implementation - Phase 1.
-   **Summary**: Starting implementation of a new general photo gallery system. This involves fetching photo data from a remote manifest, creating display components, and building pages for viewing all photos, photos by tag, and photos by date, including pagination.

## 2. What Works (Post-Blog Phase I & Recent Refinements)
-   **Core Pages**: Home, About, CV (Markdown), Contact (Netlify Forms).
-   **Blog - Foundational Refinements (Complete)**:
    *   Content collections modernized (`src/content/blog/`).
    *   Individual post rendering uses modern Astro APIs (`src/layouts/MarkDownPostLayout.astro`).
    *   `hello-world.md` test post available.
-   **Blog - Typographic Refinement for Post Layout (Complete)**:
    *   `MarkDownPostLayout.astro` uses semantic text utility classes.
    *   `.prose-serif` styles Markdown content with semantic classes.
    *   Consistent typography on individual blog posts.
    *   Semantic text utilities defined in `src/styles/base.css`.
-   **Blog - URL Structure, Listing Pages, and Card Styling (Complete as of 2025-06-04)**:
    *   **URL Structure**: Posts now at `/blog/[slug]` (no `.md` extension). Dynamic route is `src/pages/blog/[...slug].astro`.
    *   **Listing Pages**:
        *   Main listing at `/blog/` (`src/pages/blog/index.astro`).
        *   Tag-specific listings at `/tags/[tag]/` (`src/pages/tags/[tag].astro`).
        *   Both pages display posts as a grid of DaisyUI cards.
        *   Page titles (`<h1>`) use `text-heading-1` semantic class.
    *   **`BlogPost.astro` Component**:
        *   Enhanced as a DaisyUI card displaying title, date, description, thumbnail, and tags.
        *   Uses semantic typography classes for its content.
        *   Integrates `OptimizedImage.astro` for thumbnails.
    *   **RSS Feed**: `src/pages/rss.xml.js` updated for new paths and collection.
    *   **Tag Pages**: `src/pages/tags/[tag].astro` updated for new paths, collection, and robust tag handling.
-   **Image Optimization & Rendering**:
    *   `OptimizedImage.astro` component:
        *   Integrated into `MarkDownPostLayout.astro` and `BlogPost.astro`.
        *   Handles remote image dimension inference for CLS prevention.
        *   `picture` tag does not impose `max-width`, allowing parent containers to control size.
        *   Correctly fills `figure` elements in cards, respecting aspect ratios and card corner rounding.
    *   Basic `astro:assets` AVIF/JPEG optimization.
-   **Photo Lightbox**: Basic PhotoSwipe prototype on About page.
-   **Styling & Theming**: Tailwind CSS, DaisyUI, Light/Dark theme switching.
-   **Deployment**: Netlify deployment, functional build process.

## 3. Current Task: General Photo Gallery Implementation (Phase 1 - In Progress)
-   **Goal**: Implement a new general photo gallery system using `image_manifest.json` from `https://share.kadykov.com`.
-   **Key Implementation Steps**:
    *   Define a Zod schema for validating the fetched `image_manifest.json` data.
    *   Create `src/components/PhotoGallery.astro` to display photo thumbnails using `OptimizedImage.astro` and integrate with `PhotoSwipe.astro` for lightbox functionality. Start with a simple CSS-based justified layout.
    *   Create main gallery page `src/pages/photos/index.astro` to display all photos, with pagination.
    *   Create tag-based gallery pages:
        *   `src/pages/photos/tags/index.astro`: Lists all unique photo tags.
        *   `src/pages/photos/tags/[tag].astro`: Displays photos for a specific tag, with pagination. (Photo tags separate from blog tags).
    *   Create date-based gallery pages:
        *   `src/pages/photos/dates/index.astro`: Lists all unique dates (YYYY-MM-DD).
        *   `src/pages/photos/dates/[date].astro`: Displays photos for a specific date.
    *   Update site navigation to include links to new gallery sections.
    *   Cleanup: Remove old `self-portrait.json` gallery and `src/pages/galleries/self-portrait.astro`.
-   **Previous Task (Complete)**: Blog Refinement - URL Structure, Listing Page Styling, and Image Handling.

## 4. Planned Next Steps
-   **Complete General Photo Gallery Implementation (Phase 1)**: Focus on the steps outlined in section 3.
-   **Future Photo Gallery Enhancements (Phase 2+)**:
    *   Refine gallery layout (e.g., explore `justified-layout` npm package or advanced CSS).
    *   Implement individual photo pages if deemed necessary (for SEO, sharing).
    *   Develop "Artistic Galleries" and "Strangers Gallery" concepts, potentially leveraging the general gallery framework.
-   **Site-wide Typographic Consistency**:
    *   Extend the use of semantic text utility classes to other pages and components.
-   **Blog Enhancements**:
    *   MDX for complex posts.
    *   OpenGraph tags & social sharing.
    *   Comments system (evaluation).
    *   Drafting and publishing actual blog content.

## 5. What's Left to Build / Improve (Other Areas)
-   **Photo Galleries**:
    *   **General Photo Gallery**: Currently in progress (see section 3).
    *   Future: "Strangers Gallery" (date/location nav), thematic galleries with unique styling, further lightbox refinements.
-   **CV Page**: DaisyUI timeline, interactivity.
-   **Front Page**: Interactivity, landing page style.
-   **Footer**: Add links/info.
-   **Refactoring and Maintenance**: Utilize new Tailwind/DaisyUI features, testing strategy, devcontainer improvements, advanced font subsetting, general refactoring, Husky, ESLint, CI/CD, `justfile`.

## 6. Known Issues & Areas for Attention
-   Styling/layout issues identified in `hello-world.md` post (typography largely addressed, other spacing/layout might need review).
-   (Other existing known issues from previous version of this file remain relevant for future work beyond the blog).
