# Active Context: Personal Website (kadykov.com)

This document tracks the current state of work, recent decisions, and immediate next steps for the kadykov.com website project.

## 1. Current Focus
-   **Date**: 2025-05-12
-   **Activity**: Implementing `OptimizedImage.astro` component and integrating it into the blog layout. This addresses Issue #5 (Image Rendering) identified after completing Phase I of blog foundational refinements.
-   **Primary Goal**: Create a reusable image component that leverages `widthSet.ts` and `astro:assets` for consistent and efficient image optimization.
-   **Status**: Planning for `OptimizedImage.astro` complete. Implementation starting.

## 2. Recent Key Activities & Decisions
-   **Blog Phase I Completion (2025-05-10)**:
    *   Modernized blog content collections (`src/content.config.ts`, moved files to `src/content/blog/`).
    *   Updated individual post rendering (`src/pages/posts/[...id].astro`) and layout (`src/layouts/MarkDownPostLayout.astro`) for modern Astro APIs and core styling.
    *   Cleaned up blog listing page (`src/pages/blog.astro`).
    *   Addressed build issues related to content collections by modernizing `galleriesCollection` and moving its data to `src/content/galleries/`, and updating `src/pages/galleries/self-portrait.astro`.
-   **Post-Phase I Review & New Task Identification (2025-05-11/12)**:
    *   User identified several styling/layout issues with the `hello-world` blog post.
    *   Decision to address these issues, starting with image rendering (Issue #5).
    *   Planned creation of a reusable `OptimizedImage.astro` component.
    *   Agreed on initial specs for `OptimizedImage.astro` (using `<Picture />`, `maxScaling` prop, `widthSet.ts`).
    *   Deferred advanced features for `OptimizedImage.astro` (per-format scaling, noMaxScaling flag).
-   Key files for `OptimizedImage.astro` planning reviewed: `src/utils/widthSet.ts`, `src/components/PhotoSwipe.astro`, `src/components/RemotePhoto.astro`, `src/pages/about.mdx`.

## 3. Key Files Examined Recently (for OptimizedImage.astro)
-   `src/utils/widthSet.ts`
-   `src/components/PhotoSwipe.astro`
-   `src/components/RemotePhoto.astro`
-   `src/pages/about.mdx`
-   `src/layouts/MarkDownPostLayout.astro` (for integration context)

## 4. Immediate Next Steps (Cline's Perspective - OptimizedImage.astro)
1.  Update Memory Bank files (`activeContext.md`, `progress.md`, `systemPatterns.md`, `.clinerules`) to reflect the plan for `OptimizedImage.astro`. (This step)
2.  Create `src/components/OptimizedImage.astro` with the agreed-upon initial version (using `<Picture />`, `maxScaling` default to 3, `enforceAspectRatio` support).
3.  Integrate `OptimizedImage.astro` into `src/layouts/MarkDownPostLayout.astro` for the featured blog image, using `displayWidth={800}` and `enforceAspectRatio="16:9"`.
4.  Address other identified styling issues from the `hello-world` post review (duplicate titles, spacing, description typography, content alignment) in subsequent steps.

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
