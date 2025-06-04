# Active Context: Personal Website (kadykov.com)

This document tracks the current state of work, recent decisions, and immediate next steps for the kadykov.com website project.

## 1. Current Focus
-   **Date**: 2025-06-04
-   **Activity**: Completed comprehensive blog refinement: URL structure, styling of listing pages, and image rendering in post cards.
-   **Primary Goal**: Address issues with `.md` extensions in URLs, unstyled blog listing page, and inconsistent blog content paths. Improve overall blog presentation and functionality.
-   **Status**: Task complete. Memory Bank update in progress.

## 2. Recent Key Activities & Decisions
-   **Blog Refinement (2025-06-03/04)**:
    *   **URL Structure**:
        *   Individual blog posts moved from `/posts/name.md` to `/blog/name`.
        *   Dynamic route `src/pages/posts/[...id].astro` replaced with `src/pages/blog/[...slug].astro`, using `entry.slug` for clean URLs.
    *   **Blog Listing Page**:
        *   `src/pages/blog.astro` renamed to `src/pages/blog/index.astro` (serves `/blog/`).
        *   Styled using DaisyUI cards via an enhanced `src/components/BlogPost.astro` component.
        *   `BlogPost.astro` now displays title, date, description, thumbnail (via `OptimizedImage.astro`), and tags.
        *   Semantic typography classes (e.g., `text-heading-1`) applied to page titles.
    *   **Component Interactions & Styling (`OptimizedImage.astro`, `BlogPost.astro`)**:
        *   Refined `OptimizedImage.astro` to ensure correct dimension handling for remote images (preventing CLS) and removed `max-width` style from its `picture` tag to allow flexible sizing by parent containers.
        *   Ensured `OptimizedImage` (specifically its `picture` tag) and its wrapping `a` tag in `BlogPost.astro` are `block w-full` to correctly fill the `figure` element in cards. This resolved issues with image corners appearing square.
        *   Adjusted `displayWidth` and `sizesAttr` for `OptimizedImage` in `BlogPost.astro` for better responsive image loading.
    *   **Related Fixes**:
        *   Updated `src/pages/rss.xml.js` and `src/pages/tags/[tag].astro` to use the new `/blog/` path structure and `getCollection("blog")`.
        *   Handled optional tags correctly in `src/pages/tags/[tag].astro`.
-   **Previous - `OptimizedImage.astro` Implementation (Mid-May 2025)**:
    *   `OptimizedImage.astro` component created and integrated into `MarkDownPostLayout.astro`.
    *   Typography system using semantic utility classes established and applied to blog post layout.

## 3. Key Files Modified/Examined Recently
-   `src/pages/blog/[...slug].astro` (new, replaced `src/pages/posts/[...id].astro`)
-   `src/pages/blog/index.astro` (new, replaced `src/pages/blog.astro`)
-   `src/components/BlogPost.astro` (significantly enhanced)
-   `src/components/OptimizedImage.astro` (refined for CLS and sizing)
-   `src/pages/rss.xml.js` (updated for new paths and collection name)
-   `src/pages/tags/[tag].astro` (updated for new paths, collection name, and robustness)
-   `src/styles/base.css` (referenced for semantic typography classes)

## 4. Immediate Next Steps
1.  Update Memory Bank files (`activeContext.md`, `progress.md`, `systemPatterns.md`, `techContext.md`) to reflect completed blog refinements. (This step)
2.  User to review changes and merge.
3.  User to delete `src/pages/posts/[...id].astro`.
4.  Proceed with next planned tasks from project backlog (e.g., further blog enhancements like OpenGraph tags, pagination, or other site sections).

## 5. Broader Project Ideas & Potential Future Tasks (from User)
This list is for reference and will be prioritized later. (Content remains largely the same as previous version, focusing on the blog plan above for immediate action).

-   **Blog (Post-Phase I & II)**:
    *   MDX for complex posts (PhotoSwipe integration, alternating layouts).
    *   OpenGraph tags & social sharing.
    *   Pagination.
    *   Comments system (to be evaluated).
    *   Draft actual posts.
-   **Photo Galleries**:
    *   Prototype "Strangers Gallery" (date/location navigation).
    *   Investigate image hosting solutions.
    *   Refactor lightbox (`PhotoSwipe.astro`) implementation if needed.
    *   Design thematic galleries with unique styles.
-   **CV Page**:
    *   Rebuild using DaisyUI components (e.g., timeline).
    *   Explore options for interactivity.
-   **Front Page**:
    *   Enhance interactivity.
    *   Potentially redesign as a landing page.
-   **Footer**:
    *   Add relevant links and information.
-   **Refactoring & Maintenance**:
    *   Incorporate new features from recent Tailwind CSS / DaisyUI updates.
    *   **Testing**: Unit tests, testing built JS.
    *   **Development Environment**: Switch devcontainer base.
    *   **Performance**: Optimize font subsetting.
    *   **Code Quality & Practices**: General refactoring, Husky, ESLint.
    *   **DevOps**: CI/CD pipeline, `justfile`.
