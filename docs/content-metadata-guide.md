# Content Metadata Guide

This guide explains the metadata fields used for content pages and how they serve different purposes.

## The Two-Layer Approach

We use two layers of metadata to serve different needs:

| Layer           | Purpose                              | Fields                 | Used In                                              |
| --------------- | ------------------------------------ | ---------------------- | ---------------------------------------------------- |
| **Descriptive** | SEO, clarity, discoverability        | `title`, `description` | HTML `<title>`, meta tags, search results, RSS feeds |
| **Visual**      | Attention, engagement, click-through | `headline`, `subtitle` | Hero section, OpenGraph images                       |

This separation prevents the common problem of trying to make one text serve both purposes. A good SEO title is descriptive and keyword-rich. A good visual headline is punchy and intriguing.

## Field Reference

### `title` (required)

The descriptive title for the page.

**Used in:**

- HTML `<title>` tag (with site suffix)
- OpenGraph `og:title` meta tag
- Twitter card title
- RSS feed entries
- Browser tabs
- Search engine results

**Guidelines:**

- 50-60 characters ideal (search engines truncate longer)
- Be descriptive and specific
- Include relevant keywords naturally
- Okay to be longer and more detailed

**Example:**

```yaml
title: "Designing a Photo Gallery that Respects Photographs"
```

---

### `description` (required)

The descriptive summary of the page content.

**Used in:**

- `<meta name="description">` tag
- OpenGraph `og:description` meta tag
- Twitter card description
- RSS feed summaries
- Search engine snippets

**Guidelines:**

- 120-160 characters ideal
- Summarize the page content accurately
- Include key takeaways or topics covered
- Written for search results and social previews

**Example:**

```yaml
description: "An exploration of photo gallery layout strategies — from square grids and masonry columns to justified rows — and a cell-based approach that gives landscape and portrait photos equal visual weight."
```

---

### `headline` (optional)

The attention-grabbing visual headline for the page.

**Used in:**

- Hero section `<h1>` (falls back to `title` if not provided)
- OpenGraph image main text
- Any visual/promotional context

**Guidelines:**

- **3-7 words maximum** — must be scannable at a glance
- Think YouTube thumbnail text, not video title
- Create curiosity, emotion, or intrigue
- Complement the title, don't repeat it
- Assume readers already know the topic (from title/URL)
- Bold claims, questions, or intriguing statements work well

**Examples:**
| Title | Headline |
|-------|----------|
| "Designing a Photo Gallery that Respects Photographs" | "Every Photo Gets Its Due" |
| "Natural-Sticky: A No-Animation Hide-on-Scroll Header" | "Zero JavaScript. Zero Jitter." |
| "A Small, Mathematical OKLCH Design System" | "Three Colors. Entire Theme." |
| "Why Own Your Website in the Age of Feeds" | "Your Content, Your Rules" |

**When to use:**

- Always recommended for published content
- Especially important for social sharing
- Falls back gracefully to `title` if omitted

---

### `subtitle` (optional)

Supporting context that appears below the headline.

**Used in:**

- Hero section (below the h1)
- OpenGraph image (secondary text)

**Guidelines:**

- **10-20 words maximum**
- Supports and contextualizes the headline
- Can be more descriptive than the headline
- Often explains the "how" after the headline's "what"

**Examples:**
| Headline | Subtitle |
|----------|----------|
| "Every Photo Gets Its Due" | "A cell-based grid that gives landscape and portrait photos equal visual weight without cropping" |
| "Zero JavaScript. Zero Jitter." | "Discovered via a mobile browser quirk, refined into a lightweight pattern" |
| "Texture from Math" | "Subtle, pseudo-random texture from asymmetric cell splits" |

---

## How It Works Together

When someone shares your link on social media:

```
┌─────────────────────────────────────┐
│                                     │
│  [OpenGraph Image]                  │
│  ┌─────────────────────────────┐    │
│  │  "Every Photo Gets Its Due" │    │  ← headline (attention-grabbing)
│  │   A cell-based grid that... │    │  ← subtitle (context)
│  └─────────────────────────────┘    │
│                                     │
├─────────────────────────────────────┤
│  Designing a Photo Gallery that...  │  ← title (from og:title)
│  An exploration of photo gallery... │  ← description (from og:description)
│  kadykov.com                        │
└─────────────────────────────────────┘
```

The image catches attention with the punchy headline. The caption provides full context with the descriptive title and description. **Complementary, not redundant.**

---

## Quick Reference

| Field         | Required | Max Length  | Purpose                           |
| ------------- | -------- | ----------- | --------------------------------- |
| `title`       | Yes      | ~60 chars   | SEO, browser tab, search results  |
| `description` | Yes      | ~160 chars  | Meta description, search snippets |
| `headline`    | No       | 3-7 words   | Visual attention, OG image        |
| `subtitle`    | No       | 10-20 words | Supporting context                |

---

## Frontmatter Examples

### Blog Post (full metadata)

```yaml
---
title: "Designing a Photo Gallery that Respects Photographs"
headline: "Every Photo Gets Its Due"
subtitle: "A cell-based grid that gives landscape and portrait photos equal visual weight without cropping"
pubDate: 2025-12-17
description: "An exploration of photo gallery layout strategies — from square grids and masonry columns to justified rows — and a cell-based approach that gives landscape and portrait photos equal visual weight without cropping, at the cost of space efficiency."
tags: ["css-grid", "responsive-design", "photography"]
---
```

### Static Page (minimal)

```yaml
---
title: "About me"
headline: "Science, Photos & Code"
subtitle: "Research engineer, photographer, and web developer"
description: "Learn about Aleksandr Kadykov - research engineer, photographer, and web developer passionate about THz spectroscopy, FOSS, and visual storytelling."
---
```

### Page without headline (uses title)

```yaml
---
title: "Privacy Policy"
description: "How this website handles your data and respects your privacy."
---
```
