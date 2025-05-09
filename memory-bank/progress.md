# Project Progress: Personal Website (kadykov.com)

This document tracks the development progress, current status, and known issues for the kadykov.com website.

## 1. Current Overall Status
-   **Date**: 2025-05-08
-   **Phase**: Initial Planning and Setup.
-   **Summary**: The basic website structure is in place with a few core pages. The project is currently in the phase of establishing comprehensive documentation (Memory Bank) and planning future development tasks with Cline (AI Software Engineer). No new features or major refactoring have commenced yet.

## 2. What Works (Existing Functionality)
-   **Core Pages**:
    *   Home Page (`src/pages/index.mdx`)
    *   About Page (`src/pages/about.mdx`)
    *   CV Page (`src/pages/cv.md` - currently Markdown rendered)
    *   Contact Page (`src/pages/contact.astro` - uses Netlify Forms)
-   **Basic Blog Structure**:
    *   Blog listing page (`src/pages/blog.astro`).
    *   Individual post layout (`src/layouts/MarkDownPostLayout.astro`).
    *   One template blog post (`src/data/blog/post-1.md`) exists from a tutorial.
-   **Photo Lightbox**:
    *   A basic prototype of PhotoSwipe lightbox is implemented and can be seen on the About page (likely using `src/components/PhotoSwipe.astro` and `src/pages/galleries/self-portrait.astro` as an example data source or test).
-   **Styling & Theming**:
    *   Tailwind CSS and DaisyUI are functional.
    *   Light/Dark theme switching is implemented and working.
-   **Deployment**:
    *   The website is deployable and hosted on Netlify.
    *   Build process (`npm run build`) is functional.
-   **Image Optimization**:
    *   Basic AVIF/JPEG optimization via `astro:assets` is in place as demonstrated in `PhotoSwipe.astro`.

## 3. What's Left to Build / Improve (High-Level from User's Ideas)
This is a summary of desired enhancements and new features. Prioritization will follow.

-   **Blog**:
    *   Adapt current blog structure to meet specific needs.
    *   Create actual blog content.
    *   Remove template/tutorial blog posts.
-   **Photo Galleries**:
    *   **"Strangers Gallery"**: Design and implement this specialized gallery with date/location navigation.
    *   **Thematic Galleries**: Develop concepts and implementations for other gallery types.
    *   **Image Hosting**: Address potential limitations of Flickr for the "Strangers Gallery" and explore alternatives if necessary.
    *   **Social Sharing**: Implement OpenGraph tags for better gallery sharing.
-   **CV Page**:
    *   Transform the current Markdown CV into a more structured and visually appealing page (e.g., using DaisyUI timeline).
    *   Add interactivity.
-   **Front Page**:
    *   Develop into a more engaging and interactive landing page.
-   **Footer**:
    *   Populate with useful links and information.
-   **Refactoring and Maintenance**:
    *   Full utilization of new Tailwind CSS / DaisyUI features.
    *   Implementation of a testing strategy (unit tests, etc.).
    *   Devcontainer improvements (switch from Alpine).
    *   Advanced font subsetting.
    *   General code refactoring.
    *   Migration from Python pre-commit hooks to Husky.
    *   Introduction of ESLint.
    *   Setup of CI/CD pipeline.
    *   Creation of a `justfile`.

## 4. Known Issues & Areas for Attention (from User Initial Input)
-   A template blog post (`src/data/blog/post-1.md` and potentially `src/data/blog/research-lab-tips.md`) is still present from an AstroJS tutorial and needs removal or replacement.
-   The current PhotoSwipe lightbox implementation (`src/components/PhotoSwipe.astro`) might not be optimal and could benefit from refactoring.
-   The front page is currently quite empty.
-   The footer is currently quite empty.
-   Although Tailwind CSS and DaisyUI packages were updated, the website code may not yet fully leverage their new features.
-   Lack of automated tests.
-   The Alpine-based devcontainer has historical reasons but might be due for an update to a more common base like Ubuntu/Debian.
-   Font subsetting via Fontsource's default `unicode-range` might be too broad; more precise subsetting based on actual site content is desired.
-   General potential for refactoring as the initial version was a learning project for the owner with AstroJS, Tailwind CSS, and DaisyUI.
-   Current pre-commit setup uses Python hooks; a switch to Husky (more common in Node.js ecosystem) is desired.
-   No ESLint is currently configured.
-   No CI/CD pipeline exists.
-   No `justfile` for managing common commands.
