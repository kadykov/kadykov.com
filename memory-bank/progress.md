# Project Progress: Personal Website (kadykov.com)

This document tracks the development progress, current status, and known issues for the kadykov.com website.

## 1. Current Overall Status
-   **Date**: 2025-05-10
-   **Phase**: Planning - Blog Development Focus.
-   **Summary**: The basic website structure is in place. A detailed plan for overhauling and enhancing the blog functionality has been formulated. Memory Bank documentation is being updated to reflect this plan. Implementation will begin once the user switches to Act Mode.

## 2. What Works (Existing Functionality - Pre-Blog Overhaul)
-   **Core Pages**: Home, About, CV (Markdown), Contact (Netlify Forms).
-   **Basic Blog Structure (To Be Overhauled)**:
    *   Rudimentary blog listing page (`src/pages/blog.astro`).
    *   Basic individual post layout (`src/layouts/MarkDownPostLayout.astro`).
    *   Content sourced from `src/data/blog/` via `glob` loader (older Astro pattern).
    *   Placeholder tutorial content.
-   **Photo Lightbox**: Basic PhotoSwipe prototype on About page.
-   **Styling & Theming**: Tailwind CSS, DaisyUI, Light/Dark theme switching.
-   **Deployment**: Netlify deployment, functional build process.
-   **Image Optimization**: Basic `astro:assets` AVIF/JPEG optimization.

## 3. Planned Work: Blog Development (Phased Approach)

### Phase I: Foundational Refinements
-   **Task 1: Content Collection Modernization & Schema Update**
    *   Modify `src/content.config.ts`:
        *   Remove `glob` loader for `postsCollection`.
        *   Update schema: remove `author`, add `lastUpdatedDate: z.date().optional()`.
    *   Migrate blog content from `src/data/blog/` to `src/content/blog/`.
    *   Delete placeholder `src/content/blog/post-1.md`.
-   **Task 2: Individual Post Rendering Modernization & Core Styling**
    *   Update `src/pages/posts/[...id].astro` to use modern Astro content rendering (e.g., `entry.render()`).
    *   Update `src/layouts/MarkDownPostLayout.astro`:
        *   Wrap main slot in `<div class="prose-serif">`.
        *   Display metadata: `title`, `pubDate`, `description`, `lastUpdatedDate` (if applicable), `image`.
        *   Style metadata section distinctly from prose content.
-   **Task 3: Blog Listing Page (`src/pages/blog.astro`) - Initial Cleanup**
    *   Update page title to be appropriate for the site.
    *   Update/remove placeholder introductory text.

### Phase II: Enhancing Presentation & Functionality
-   **Task 4: Blog Listing Page - Enhanced Post Previews**
    *   Modify `src/components/BlogPost.astro` (or create new e.g., `BlogCard.astro`) to display: `title` (link), `pubDate`, `description` snippet, `image` (thumbnail), `tags`.
    *   Style these previews for better visual appeal and information density.
-   **Task 5: Tagging System Implementation**
    *   Display tags on individual post pages and listing page previews.
    *   Implement dynamic tag page `src/pages/tags/[tag].astro` (lists posts for a specific tag).
    *   Implement main tags index page `src/pages/tags/index.astro` (lists all unique tags with links).

### Phase III: Future Considerations (Blog)
-   MDX for complex posts (e.g., inline PhotoSwipe, custom layouts).
-   OpenGraph tags and social sharing features.
-   Pagination for the blog listing page (if post count grows).
-   Comment system (evaluation needed due to complexity/privacy).
-   Drafting and publishing actual blog content.

## 4. What's Left to Build / Improve (Other Areas - Post-Blog Focus)
This is a summary of desired enhancements and new features beyond the immediate blog focus.
-   **Photo Galleries**: "Strangers Gallery" (date/location nav), thematic galleries, image hosting, OpenGraph.
-   **CV Page**: DaisyUI timeline, interactivity.
-   **Front Page**: Interactivity, landing page style.
-   **Footer**: Add links/info.
-   **Refactoring and Maintenance**: Utilize new Tailwind/DaisyUI features, testing strategy, devcontainer improvements, advanced font subsetting, general refactoring, Husky, ESLint, CI/CD, `justfile`.

## 5. Known Issues & Areas for Attention (Pre-Blog Overhaul)
Many of these will be addressed by the planned blog work.
-   Blog uses older Astro content collection patterns (`glob` loader, `src/data/blog`).
-   Blog post layout (`MarkDownPostLayout.astro`) needs styling for metadata and consistent prose styling for content.
-   Blog listing page (`src/pages/blog.astro`) has placeholder content and very basic post links.
-   Template blog post (`src/data/blog/post-1.md`) needs removal.
-   (Other existing known issues from previous version of this file remain relevant for future work beyond the blog).
