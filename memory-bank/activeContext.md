# Active Context: Personal Website (kadykov.com)

This document tracks the current state of work, recent decisions, and immediate next steps for the kadykov.com website project.

## 1. Current Focus
-   **Date**: 2025-05-08
-   **Activity**: Initial project introduction and setup with Cline (AI Software Engineer).
-   **Primary Goal**: Establishing the Memory Bank (core documentation files: `projectbrief.md`, `productContext.md`, `systemPatterns.md`, `techContext.md`, `activeContext.md`, `progress.md`) and the `.clinerules` file.
-   **Status**: Memory Bank file creation is in progress.

## 2. Recent Key Activities & Decisions
-   Decision to examine key project files (`astro.config.mjs`, `package.json`, `tailwind.config.cjs`, `src/layouts/BaseLayout.astro`, `src/styles/base.css`, `netlify.toml`, `public/_headers`, `src/components/PhotoSwipe.astro`) before populating the Memory Bank to ensure accuracy.
-   Information from these files has been gathered and summarized for inclusion in the Memory Bank.

## 3. Key Files Examined Recently
-   `astro.config.mjs`
-   `package.json`
-   `tailwind.config.cjs`
-   `src/layouts/BaseLayout.astro`
-   `src/styles/base.css`
-   `netlify.toml`
-   `public/_headers`
-   `src/components/PhotoSwipe.astro` (from user's initial message)

## 4. Immediate Next Steps (Cline's Perspective)
1.  Complete creation of all core Memory Bank files:
    *   `activeContext.md` (this file)
    *   `progress.md`
2.  Create the `.clinerules` file (initially with some foundational observations).
3.  Once the Memory Bank is established, engage with the user to:
    *   Discuss their priorities among the many ideas presented (Blog, Photo Galleries, CV, Front Page, Footer, Refactoring/Maintenance).
    *   Formulate a more detailed development plan for the chosen priority.
    *   Determine if any further information gathering is needed for the chosen task.

## 5. Broader Project Ideas & Potential Future Tasks (from User)
This list is for reference and will be prioritized later.

-   **Blog**:
    *   Adapt existing blog implementation.
    *   Draft posts (e.g., "why personal website," touch typing, stereographic projection, quitting alcohol, degoogled Android, self-hosted services).
-   **Photo Galleries**:
    *   Prototype "Strangers Gallery" (date/location navigation).
    *   Investigate image hosting solutions (beyond Flickr's 1000 image limit for this type of gallery).
    *   Refactor lightbox (`PhotoSwipe.astro`) implementation if needed.
    *   Implement OpenGraph tags for social media sharing and previews.
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
    *   **Testing**:
        *   Consider unit tests for components.
        *   Investigate testing Astro's processed/built JavaScript.
    *   **Development Environment**:
        *   Switch from Alpine-based devcontainer to Ubuntu/Debian-based.
    *   **Performance**:
        *   Optimize font subsetting (beyond current `unicode-range` in Fontsource files) to only include characters used on the site.
    *   **Code Quality & Practices**:
        *   General refactoring (as it was a first project with these technologies).
        *   Replace Python pre-commit hooks with Husky.
        *   Add ESLint for JavaScript/TypeScript linting.
    *   **DevOps**:
        *   Create a CI/CD pipeline.
        *   Add a `justfile` for common development commands.
