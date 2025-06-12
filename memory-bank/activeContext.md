# Active Context: Personal Website (kadykov.com)

This document tracks the current state of work, recent decisions, and immediate next steps for the kadykov.com website project.

## 1. Current Focus
-   **Date**: 2025-06-11
-   **Activity**: Implementing Phase 1 of Photo Linking: Hash-based deep linking for photos within PhotoSwipe.
-   **Primary Goal**: Enable users to link directly to a specific photo in a gallery, opening it in the PhotoSwipe lightbox, by using URL hash identifiers. Ensure this works robustly with pagination by loading the full gallery context for PhotoSwipe.
-   **Status**: Planning complete. Implementation starting.

## 2. Recent Key Activities & Decisions
-   **Photo Linking Strategy (2025-06-11)**:
    *   **Phase 1 (Current Focus)**: Implement hash-based deep linking.
        *   **Slugs**: Generate unique slugs for each photo (e.g., `YYYY-MM-DD-filename`).
        *   **Full Context for PhotoSwipe**: Gallery pages will provide the full photo dataset for the current context (e.g., all photos for a tag) to PhotoSwipe, not just the paginated thumbnail view.
        *   **URL Handling**: Client-side JavaScript (`photoswipe.js`) will:
            *   Read the URL hash on page load to open PhotoSwipe to the specified photo.
            *   Update the URL hash as the user navigates within PhotoSwipe.
    *   **Phase 2 (Deferred)**: Implement dedicated photo pages (e.g., `/photo/[slug].astro`) for SEO and social media previews. This will include updating PhotoSwipe's share functionality to use these canonical URLs.
-   **PhotoSwipe Caption Enhancement & Date Pagination (2025-06-09)**:
    *   Integrated `photoswipe-dynamic-caption-plugin` to display photo title, description, date, and tags in the PhotoSwipe lightbox.
    *   Metadata is passed via `data-*` attributes from `PhotoGallery.astro` to `photoswipe.js`.
    *   Captions are styled using Tailwind CSS utility classes directly in `photoswipe.js`.
    *   Date and tag links in captions point to their respective paginated archive pages (e.g., `/photos/dates/YYYY-MM-DD/1`, `/photos/tags/[tag]/1`).
    *   Implemented pagination for date-specific photo gallery pages (`src/pages/photos/dates/[date]/[page].astro`), similar to tag pages.
-   **General Photo Gallery Planning (2025-06-05)**:
    *   **Data Source**: Decided to fetch `image_manifest.json` directly from `https://share.kadykov.com` in `getStaticPaths` for gallery pages. A Zod schema will be used for type safety.
    *   **Core Component**: `PhotoGallery.astro` will be created to display photo thumbnails (using `OptimizedImage.astro`) and integrate with `PhotoSwipe.astro` for lightbox.
    *   **Layout**: Start with a simple CSS-based justified layout, iterate later.
    *   **Pages**:
        *   Main gallery: `/photos/index.astro` (all photos, paginated).
        *   Tag galleries: `/photos/tags/index.astro` (list of tags), `/photos/tags/[tag].astro` (photos for a specific tag, paginated). Photo tags will be separate from blog tags.
        *   Date galleries: `/photos/dates/index.astro` (list of dates), `/photos/dates/[date].astro` (photos for a specific date, e.g., YYYY-MM-DD).
    *   **Individual Photo Pages**: Deferred for now, relying on PhotoSwipe.
    *   **Cleanup**: Old `self-portrait.json` gallery and related pages will be removed.
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
-   `src/scripts/photoswipe.js` (updated for dynamic captions and styling)
-   `src/components/PhotoGallery.astro` (updated to provide data attributes for captions)
-   `src/pages/photos/dates/[date]/[page].astro` (updated for pagination)

## 4. Immediate Next Steps
1.  **Update Memory Bank**: (Done for this iteration)
    *   Update `activeContext.md` (this document).
    *   Update `progress.md`.
    *   Update `systemPatterns.md`.
2.  **Implement General Photo Gallery**:
    *   Define Zod schema for `image_manifest.json` data. (Done)
    *   Create `src/components/PhotoGallery.astro`.
    *   Create gallery pages: `/photos/index.astro`, `/photos/tags/index.astro`, `/photos/tags/[tag].astro`, `/photos/dates/index.astro`, `/photos/dates/[date].astro`.
    *   Implement pagination. (Partially done for dates/tags, main gallery pending)
    *   Update navigation.
    *   Add `share.kadykov.com` to `image.domains` in `astro.config.mjs` (user confirmed this is already done).
3.  **Implement Photo Linking - Phase 1 (Hash-based deep linking)**:
    *   Modify gallery pages (`getStaticPaths` or utility functions) to generate unique slugs (`YYYY-MM-DD-filename`) for each photo.
    *   Ensure gallery pages pass the *full* photo dataset (including slugs) for the current context to the client-side script that initializes PhotoSwipe.
    *   Update `src/scripts/photoswipe.js`:
        *   On load, check `window.location.hash`, parse slug, find photo index, and open PhotoSwipe to that photo.
        *   On PhotoSwipe slide change (`afterChange` event), update `window.location.hash` with the current photo's slug.
4.  **Cleanup Old Gallery System**:
    *   Remove `src/content/galleries/self-portrait.json`.
    *   Remove `src/pages/galleries/self-portrait.astro`.
5.  User to review changes and merge.
6.  Proceed with next planned tasks from project backlog (including Phase 2 of Photo Linking).

## 5. Broader Project Ideas & Potential Future Tasks (from User)
This list is for reference and will be prioritized later.

-   **Blog (Post-Phase I & II)**:
    *   MDX for complex posts (PhotoSwipe integration, alternating layouts).
    *   OpenGraph tags & social sharing.
    *   Pagination (already implemented for main blog listing, consider for tags if needed).
    *   Comments system (to be evaluated).
    *   Draft actual posts.
-   **Photo Galleries**:
    *   **General Photo Gallery (Current Task)**: Complete pagination for main gallery, tag index, date index. Implement Phase 1 of Photo Linking.
    *   **Photo Linking - Phase 2 (Future)**: Implement dedicated photo pages (`/photo/[slug].astro`) for SEO and social media previews. Update PhotoSwipe share functionality.
    *   Future: Artistic galleries, "Strangers Gallery" (may leverage general gallery with specific filters/views).
    *   Refactor lightbox (`PhotoSwipe.astro`) implementation if needed during/after general gallery implementation.
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
