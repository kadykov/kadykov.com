# Project Progress: Personal Website (kadykov.com)

This document tracks the development progress, current status, and known issues for the kadykov.com website.

## 1. Current Overall Status

- **Date**: 2025-06-12
- **Phase**: Photo Gallery Refinements Completed.
- **Summary**: Hash-based deep linking using pre-generated slugs in PhotoSwipe is fully implemented and functional. Lightbox navigation is correctly scoped for main, tag-specific, and date-specific galleries. All gallery pages (`/photos/[page].astro`, `/photos/tags/[tag]/[page].astro`, `/photos/dates/[date]/[page].astro`) have been updated. `image_manifest.json` now requires slugs.

## 2. What Works (Post-Blog Phase I & Recent Refinements)

- **Core Pages**: Home, About, CV (Markdown), Contact (Netlify Forms).
- **Blog - Foundational Refinements (Complete)**:
  - Content collections modernized (`src/content/blog/`).
  - Individual post rendering uses modern Astro APIs (`src/layouts/MarkDownPostLayout.astro`).
  - `hello-world.md` test post available.
- **Blog - Typographic Refinement for Post Layout (Complete)**:
  - `MarkDownPostLayout.astro` uses semantic text utility classes.
  - `.prose` styles Markdown content with semantic classes.
  - Consistent typography on individual blog posts.
  - Semantic text utilities defined in `src/styles/base.css`.
- **Blog - URL Structure, Listing Pages, and Card Styling (Complete as of 2025-06-04)**:
  - **URL Structure**: Posts now at `/blog/[slug]` (no `.md` extension). Dynamic route is `src/pages/blog/[...slug].astro`.
  - **Listing Pages**:
    - Main listing at `/blog/` (`src/pages/blog/index.astro`).
    - Tag-specific listings at `/tags/[tag]/` (`src/pages/tags/[tag].astro`).
    - Both pages display posts as a grid of DaisyUI cards.
    - Page titles (`<h1>`) use `text-heading-1` semantic class.
  - **`BlogPost.astro` Component**:
    - Enhanced as a DaisyUI card displaying title, date, description, thumbnail, and tags.
    - Uses semantic typography classes for its content.
    - Integrates `OptimizedImage.astro` for thumbnails.
  - **RSS Feed**: `src/pages/rss.xml.js` updated for new paths and collection.
  - **Tag Pages**: `src/pages/tags/[tag].astro` updated for new paths, collection, and robust tag handling.
- **Image Optimization & Rendering**:
  - `OptimizedImage.astro` component:
    - Integrated into `MarkDownPostLayout.astro` and `BlogPost.astro`.
    - Handles remote image dimension inference for CLS prevention.
    - `picture` tag does not impose `max-width`, allowing parent containers to control size.
    - Correctly fills `figure` elements in cards, respecting aspect ratios and card corner rounding.
  - Basic `astro:assets` AVIF/JPEG optimization.
- **Photo Gallery Thumbnail Component (`PhotoGallery.astro`) - Functionality Complete**:
  - Displays photo thumbnails using `OptimizedImage.astro`.
  - Integrates with PhotoSwipe JS for lightbox functionality.
  - Uses Tailwind CSS Columns for a responsive masonry layout.
  - Features a "zoom within frame" hover effect with rounded corners.
  - Correctly handles `sizes` attributes for responsive image loading.
  - Configured for PhotoSwipe to download original JPEGs while displaying optimized AVIFs.
- **Photo Lightbox**:
  - Main gallery uses PhotoSwipe JS via `PhotoGallery.astro`.
  - Enhanced with dynamic captions using `photoswipe-dynamic-caption-plugin`.
  - Captions display photo title, description, date, and tags with clickable links to archive pages.
  - Styling of captions achieved using Tailwind CSS utility classes directly in `photoswipe.js`.
  - URL hash updates correctly reflect the current photo's slug.
  - Lightbox navigation is correctly scoped for main, tag, and date galleries.
- **Styling & Theming**: Tailwind CSS, DaisyUI, Light/Dark theme switching.
- **Deployment**: Netlify deployment, functional build process.

## 2025-06-12

- **Photo Gallery Slug & Lightbox Scoping Refinements (Completed)**
  - **Slug Requirement**: `slug` field made mandatory in `image_manifest.json` and `src/utils/photoManifestSchema.ts`.
  - **Runtime Slug Generation Removed**: All gallery pages (`/photos/[page].astro`, `/photos/tags/[tag]/[page].astro`, `/photos/dates/[date]/[page].astro`) now rely on slugs from the manifest.
  - **Lightbox Scoping**:
    - Tag pages pass only tag-specific photos as `fullPhotoDataset` to `PhotoGallery.astro`.
    - Date pages pass only date-specific photos as `fullPhotoDataset`.
    - Main gallery pages pass all photos as `fullPhotoDataset`.
    - This ensures PhotoSwipe navigation is correctly limited to the relevant photo set.
  - **URL Hash**: Deep linking via URL hash (using slugs) and hash updates during lightbox navigation confirmed working correctly across all gallery types.
  - `photoswipe.js` updated to gracefully handle (clear hash) if a slug is empty, though this is now less likely.

## 2025-06-11

- **Photo Linking Strategy - Phase 1 Planning (Completed)**
  - **Goal**: Implement hash-based deep linking for photos within PhotoSwipe.
  - **Slug Generation**: Unique slugs (`YYYY-MM-DD-filename`) will be generated for each photo.
  - **Full Context for PhotoSwipe**: Gallery pages will provide the full photo dataset for the current context to PhotoSwipe.
  - **URL Hash Handling**: `photoswipe.js` will be updated to read the URL hash on load to open a specific photo and update the hash as the user navigates in the lightbox.
  - **Phase 2 Deferred**: Dedicated photo pages (`/photo/[slug].astro`) for SEO/social sharing are planned for a future phase.

## 2025-06-09

- **PhotoSwipe Lightbox Caption Enhancement (Completed)**
  - Integrated `photoswipe-dynamic-caption-plugin` into `src/scripts/photoswipe.js`.
  - Modified `src/components/PhotoGallery.astro` to pass `data-title`, `data-description`, `data-date`, and `data-tags` attributes to PhotoSwipe.
  - The plugin's `captionContent` function now dynamically generates HTML for captions, including:
    - Photo title (using `text-heading-4`).
    - Photo description (using `text-body-standard-serif`).
    - Clickable date link (YYYY-MM-DD format, linking to `/photos/dates/YYYY-MM-DD/1`) styled as a DaisyUI button.
    - Clickable tag links (linking to `/photos/tags/[tag]/1`) styled as DaisyUI buttons.
  - Caption text styled with `text-gray-300` for readability on the dark caption background. Button styles adjusted for this context using Tailwind utilities.
  - Corrected pagination for date-specific gallery pages (`src/pages/photos/dates/[date]/[page].astro`).

## 2025-06-08

- **`PhotoGallery.astro` Component - Fixes & Enhancements (Completed)**
  - **Layout:** Switched from CSS Grid to Tailwind CSS Columns (`columns-2 sm:columns-3xs gap-4`) for a responsive masonry-like layout, resolving previous cropping and column issues.
  - **Hover Effect:** Implemented a "zoom within frame" hover effect (`hover:scale-105`) with rounded corners, by applying `overflow-hidden rounded-lg` and transform/transition classes to the parent `<a>` tag, and `rounded-lg` to the child `OptimizedImage` component.
  - **Thumbnail Overlay:** Removed the title/description overlay from thumbnails as per user request.
  - **Thumbnail Resolution:** Adjusted `displayWidth` (to `300`) and `sizesAttr` (to `'(min-width: 680px) 256px, 50vw'`) for `OptimizedImage` to improve responsive image loading and better match the column layout.
  - **PhotoSwipe Integration:**
    - Ensured `href` on `<a>` tags points to the original JPEG for download.
    - Set `data-pswp-src` to the original JPEG URL to align with observed download behavior and ensure JPEG downloads.
    - `data-pswp-srcset` continues to provide AVIF images for optimized display in the lightbox.
    - Removed unused WebP fallback generation for `data-pswp-src`.
  - **Astro Parser Issues:** Resolved parser errors related to complex JavaScript in the template by moving logic to helper functions/component script.
  - **General Stability:** Addressed various bugs and refined component behavior based on iterative feedback.

## 2025-06-07

- **Typography System & Blog Layout Refinement (Completed)**
  - Implemented semantic typography utility classes (`.text-heading-1`, `.text-body-standard-serif`, etc.) in `src/styles/base.css`.
  - Refined `MarkDownPostLayout.astro` to use these semantic classes for titles, metadata, etc.
  - Updated `.prose` in `src/styles/base.css` to apply these semantic classes to corresponding Markdown elements (e.g., `prose-h1:text-heading-1`), ensuring consistent typography between standalone elements and Markdown content. This resolved issues with customizing Tailwind Typography effectively.
  - Verified consistent typography on `hello-world.md` blog post.

## 3. Current Task: Photo Linking Implementation (Phase 1 - Starting) & Gallery Finalization

- **Goal**: Implement hash-based deep linking and complete remaining gallery pages (main gallery, tag index, date index pagination).
- **Key Implementation Steps for Photo Linking (Phase 1)**:
  - **Slug Generation**: Modify gallery page data fetching (e.g., in `getStaticPaths` or utility functions) to generate unique slugs (`YYYY-MM-DD-filename`) for each photo.
  - **Full Context for PhotoSwipe**: Ensure gallery pages pass the _full_ photo dataset (including slugs) for the current context to the client-side script that initializes PhotoSwipe.
  - **Update `photoswipe.js`**:
    - On load, check `window.location.hash`, parse slug, find photo index, and open PhotoSwipe to that photo.
    - On PhotoSwipe slide change (`afterChange` event), update `window.location.hash` with the current photo's slug.
- **Key Implementation Steps for Gallery Finalization**:
  - Create main gallery page `src/pages/photos/[page].astro` (or `src/pages/photos/index.astro` if only one page initially) to display all photos, with pagination. (Next)
  - Create tag-based gallery pages:
    - `src/pages/photos/tags/index.astro`: Lists all unique photo tags. (Next)
    - Pagination for `src/pages/photos/tags/[tag]/[page].astro` is implemented.
  - Create date-based gallery pages:
    - `src/pages/photos/dates/index.astro`: Lists all unique dates (YYYY-MM-DD). (Next)
    - Pagination for `src/pages/photos/dates/[date]/[page].astro` is implemented.
  - Update site navigation to include links to new gallery sections.
  - Cleanup: Remove old `self-portrait.json` gallery and `src/pages/galleries/self-portrait.astro`.
- **Previous Task (Complete)**: Blog Refinement - URL Structure, Listing Page Styling, and Image Handling.

## 4. Planned Next Steps

- **Complete Photo Linking (Phase 1) & Gallery Finalization**: Focus on the steps outlined in section 3.
- **Photo Linking (Phase 2 - Future)**: Implement dedicated photo pages (`/photo/[slug].astro`) for SEO and social media previews. Update PhotoSwipe share functionality.
- **Future Photo Gallery Enhancements**:
  - Refine gallery layout (e.g., explore `justified-layout` npm package or advanced CSS).
  - Develop "Artistic Galleries" and "Strangers Gallery" concepts, potentially leveraging the general gallery framework.
- **Site-wide Typographic Consistency**:
  - Extend the use of semantic text utility classes to other pages and components.
- **Blog Enhancements**:
  - MDX for complex posts.
  - OpenGraph tags & social sharing.
  - Comments system (evaluation).
  - Drafting and publishing actual blog content.

## 5. What's Left to Build / Improve (Other Areas)

- **Photo Galleries**:
  - **Current**: Implement Phase 1 Photo Linking and finalize gallery pages/pagination.
  - **Future (Phase 2 Photo Linking)**: Dedicated photo pages for SEO/sharing.
  - Future: "Strangers Gallery" (date/location nav), thematic galleries with unique styling, further lightbox refinements.
- **CV Page**: DaisyUI timeline, interactivity.
- **Front Page**: Interactivity, landing page style.
- **Footer**: Add links/info.
- **Refactoring and Maintenance**: Utilize new Tailwind/DaisyUI features, testing strategy, devcontainer improvements, advanced font subsetting, general refactoring, Husky, ESLint, CI/CD, `justfile`.

## 6. Known Issues & Areas for Attention

- Styling/layout issues identified in `hello-world.md` post (typography largely addressed, other spacing/layout might need review).
- (Other existing known issues from previous version of this file remain relevant for future work beyond the blog).
