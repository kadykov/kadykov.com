# Project Progress: Personal Website (kadykov.com)

This document tracks the development progress, current status, and known issues for the kadykov.com website.

## 1. Current Overall Status
-   **Date**: 2025-05-12
-   **Phase**: Blog Refinement - Implementing `OptimizedImage.astro`.
-   **Summary**: Phase I of blog foundational refinements is complete. Currently addressing styling and layout issues identified in the `hello-world` post, starting with the creation of a reusable `OptimizedImage.astro` component.

## 2. What Works (Post-Blog Phase I)
-   **Core Pages**: Home, About, CV (Markdown), Contact (Netlify Forms).
-   **Blog - Foundational Refinements (Complete)**:
    *   Content collections modernized (blog content now in `src/content/blog/`, schema updated in `src/content.config.ts`).
    *   Individual post rendering uses modern Astro APIs (`src/pages/posts/[...id].astro`).
    *   `MarkDownPostLayout.astro` updated for core metadata display and prose styling.
    *   Blog listing page (`src/pages/blog.astro`) placeholders cleaned up.
    *   `hello-world.md` test post created in `src/content/blog/`.
    *   Build issues related to content collections (blog and galleries) resolved.
-   **Photo Lightbox**: Basic PhotoSwipe prototype on About page.
-   **Styling & Theming**: Tailwind CSS, DaisyUI, Light/Dark theme switching.
-   **Deployment**: Netlify deployment, functional build process.
-   **Image Optimization**: Basic `astro:assets` AVIF/JPEG optimization (to be enhanced by `OptimizedImage.astro`).

## 3. Current Task: Create `OptimizedImage.astro` Component
-   **Goal**: Develop a reusable Astro component for consistent, optimized image rendering using `astro:assets`, `<Picture />`, and `widthSet.ts`.
-   **Features (Initial Version)**:
    *   Props: `src`, `alt`, `displayWidth`, `sizesAttr`, `maxScaling` (default 3), `class`, `loading`, `decoding`, `quality`, `enforceAspectRatio`.
    *   Logic: Calculate `currentWidthSet` based on `fullWidth`, `displayWidth`, and `maxScaling`, using global `widthSet`.
    *   Output: `<Picture />` component with AVIF, WebP formats, and JPEG fallback.
-   **Integration**: Will be used in `MarkDownPostLayout.astro` for featured images.
-   **Future Enhancements (Deferred)**: Per-format scaling factors, `noMaxScaling` option.

## 4. Planned Next Steps (Post-OptimizedImage.astro)
-   Integrate `OptimizedImage.astro` into `MarkDownPostLayout.astro`.
-   Address remaining styling/layout issues from `hello-world` post review:
    *   Spacing around blog post title/header.
    *   Overall typographic consistency (long-term task).
-   **Blog Phase II: Enhancing Presentation & Functionality**
-   **Task 4: Blog Listing Page - Enhanced Post Previews**
    *   Modify `src/components/BlogPost.astro` (or create new e.g., `BlogCard.astro`) to display: `title` (link), `pubDate`, `description` snippet, `image` (thumbnail), `tags`.
    *   Style these previews for better visual appeal and information density.
    *   Task 4: Blog Listing Page - Enhanced Post Previews.
    *   Task 5: Tagging System Implementation (noting existing tag pages).
-   **Blog Phase III: Future Considerations (Blog)**
    *   MDX for complex posts.
    *   OpenGraph tags & social sharing.
    *   Pagination.
    *   Comments system.
    *   Drafting and publishing actual blog content.

## 5. What's Left to Build / Improve (Other Areas - Post-Blog Focus)
(Content remains largely the same as previous version)
-   **Photo Galleries**: "Strangers Gallery" (date/location nav), thematic galleries, image hosting, OpenGraph.
-   **CV Page**: DaisyUI timeline, interactivity.
-   **Front Page**: Interactivity, landing page style.
-   **Footer**: Add links/info.
-   **Refactoring and Maintenance**: Utilize new Tailwind/DaisyUI features, testing strategy, devcontainer improvements, advanced font subsetting, general refactoring, Husky, ESLint, CI/CD, `justfile`.

## 6. Known Issues & Areas for Attention
-   Styling/layout issues identified in `hello-world.md` post (being addressed).
-   (Other existing known issues from previous version of this file remain relevant for future work beyond the blog).
