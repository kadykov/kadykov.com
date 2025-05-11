# Active Context: Personal Website (kadykov.com)

This document tracks the current state of work, recent decisions, and immediate next steps for the kadykov.com website project.

## 1. Current Focus
-   **Date**: 2025-05-10
-   **Activity**: Planning the implementation and refinement of the blog functionality.
-   **Primary Goal**: Finalize a phased plan for blog improvements, focusing on foundational modernization, enhanced presentation, and core features.
-   **Status**: Detailed plan for blog development formulated. Memory Bank updates are in progress. Next step is to begin implementation once the user switches to Act Mode.

## 2. Recent Key Activities & Decisions
-   Initial Memory Bank and `.clinerules` file established (2025-05-08).
-   Decision to prioritize blog development.
-   Detailed examination of current blog-related files:
    -   `src/components/BlogPost.astro`
    -   `src/layouts/MarkDownLayout.astro`
    -   `src/layouts/MarkDownPostLayout.astro`
    -   `src/pages/blog.astro`
    -   `src/data/blog/post-1.md` (now to be `src/content/blog/`)
    -   `src/pages/posts/[...id].astro`
    -   `src/content.config.ts`
-   Formulated a phased plan for blog improvements, covering:
    *   **Phase I (Foundational Refinements)**: Content collection modernization, schema updates, individual post rendering modernization, core styling, and blog listing page cleanup.
    *   **Phase II (Enhancing Presentation & Functionality)**: Enhanced post previews on the listing page and tagging system implementation.
    *   **Phase III (Future Considerations)**: MDX for complex posts, OpenGraph tags, pagination, comments.
-   User confirmed the plan for blog development.

## 3. Key Files Examined Recently (for Blog Planning)
-   `src/components/BlogPost.astro`
-   `src/layouts/MarkDownLayout.astro`
-   `src/layouts/MarkDownPostLayout.astro`
-   `src/pages/blog.astro`
-   `src/data/blog/post-1.md` (and its planned move to `src/content/blog/`)
-   `src/pages/posts/[...id].astro`
-   `src/content.config.ts`
-   (Previously examined core files: `astro.config.mjs`, `package.json`, `tailwind.config.cjs`, `src/layouts/BaseLayout.astro`, `src/styles/base.css`, `netlify.toml`, `public/_headers`, `src/components/PhotoSwipe.astro`)

## 4. Immediate Next Steps (Cline's Perspective - Blog Phase I)
Once the user switches to Act Mode, the following steps will be taken for Phase I of the blog development:

1.  **Content Collection Modernization & Schema Update**:
    *   Modify `src/content.config.ts`:
        *   Remove `glob` loader for `postsCollection`.
        *   Update schema: remove `author`, add `lastUpdatedDate: z.date().optional()`.
    *   Move blog content from `src/data/blog/` to `src/content/blog/`.
    *   Delete placeholder `src/content/blog/post-1.md`.
2.  **Individual Post Rendering Modernization & Core Styling**:
    *   Update `src/pages/posts/[...id].astro` to use modern Astro content rendering (e.g., `entry.render()`).
    *   Update `src/layouts/MarkDownPostLayout.astro`:
        *   Wrap main slot in `<div class="prose-serif">`.
        *   Display metadata: `title`, `pubDate`, `description`, `lastUpdatedDate` (if applicable), `image`.
        *   Style metadata section.
3.  **Blog Listing Page (`src/pages/blog.astro`) - Initial Cleanup**:
    *   Update page title.
    *   Update/remove placeholder introductory text.

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
