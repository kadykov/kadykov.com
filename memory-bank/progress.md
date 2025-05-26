# Project Progress: Personal Website (kadykov.com)

This document tracks the development progress, current status, and known issues for the kadykov.com website.

## 1. Current Overall Status
-   **Date**: 2025-05-26
-   **Phase**: Blog Refinement - Typographic Consistency.
-   **Summary**: Completed the integration of `OptimizedImage.astro` into the blog post layout. Successfully refactored the typography for `MarkDownPostLayout.astro` and its prose content (`.prose-serif`) to use a new system of semantic text utility classes, achieving consistent styling.

## 2. What Works (Post-Blog Phase I & Recent Refinements)
-   **Core Pages**: Home, About, CV (Markdown), Contact (Netlify Forms).
-   **Blog - Foundational Refinements (Complete)**:
    *   Content collections modernized.
    *   Individual post rendering uses modern Astro APIs.
    *   `hello-world.md` test post created.
    *   Build issues related to content collections resolved.
-   **Blog - Typographic Refinement for Post Layout (Complete)**:
    *   `MarkDownPostLayout.astro` updated to use semantic text utility classes for title, description, and metadata.
    *   `.prose-serif` (styling Markdown content) updated to use the same semantic text utility classes via `prose-modifier:component-class` syntax (e.g., `@apply prose-h1:text-heading-1;`).
    *   Achieved consistent and responsive typography between standalone layout elements and Markdown-generated content on blog posts.
    *   Semantic text utilities (`.text-heading-1`, `.text-body-standard-serif`, etc.) defined in `src/styles/base.css`.
-   **Image Optimization**:
    *   `OptimizedImage.astro` component developed and integrated into `MarkDownPostLayout.astro` for featured images.
    *   Basic `astro:assets` AVIF/JPEG optimization.
-   **Photo Lightbox**: Basic PhotoSwipe prototype on About page.
-   **Styling & Theming**: Tailwind CSS, DaisyUI, Light/Dark theme switching.
-   **Deployment**: Netlify deployment, functional build process.

## 3. Current Task: Typographic Consistency (Blog Post Layout - COMPLETE)
-   **Goal**: Ensure consistent typographic styling between elements in `MarkDownPostLayout.astro` and the Markdown content rendered within it.
-   **Outcome**: Successfully implemented using semantic utility classes and `prose-modifier:component-class` syntax in `src/styles/base.css`.

## 4. Planned Next Steps
-   **Site-wide Typographic Consistency**:
    *   Extend the use of semantic text utility classes to other pages and components (Homepage, About page, Contact page, Header, Footer, UI elements like buttons, form inputs).
-   Address remaining styling/layout issues from `hello-world` post review (if any beyond typography).
    *   Spacing around blog post title/header (review if current semantic class margins are sufficient).
-   **Blog Phase II: Enhancing Presentation & Functionality**
-   **Task 4: Blog Listing Page - Enhanced Post Previews**
    *   Modify `src/components/BlogPost.astro` (or create new e.g., `BlogCard.astro`) to display: `title` (link), `pubDate`, `description` snippet, `image` (thumbnail), `tags`.
    *   Style these previews for better visual appeal and information density, using semantic text utilities where appropriate.
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
-   Styling/layout issues identified in `hello-world.md` post (typography largely addressed, other spacing/layout might need review).
-   (Other existing known issues from previous version of this file remain relevant for future work beyond the blog).
