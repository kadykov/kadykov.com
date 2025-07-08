# Markdoc Blog Implementation

This project has been migrated from standard Markdown to Markdoc for enhanced image handling and component integration.

## Features

- **Standard Markdown syntax** - All existing `![alt](src)` syntax continues to work
- **Custom figure tags** - Enhanced image display with captions and styling
- **Optimized images** - Integration with OptimizedImage component for performance
- **Remote image support** - Graceful fallback for external images
- **Flexible configuration** - Easy to extend with new components

## Image Usage

### Standard Markdown Syntax

```markdown
![Alt text](/path/to/image.jpg)
```

- Uses basic img tag with responsive styling
- Works for both local and remote images

### Figure Tag

```markdown
{% figure src="/path/to/image.jpg" alt="Alt text" caption="Image caption" /%}
```

- Adds semantic figure/figcaption markup
- Includes styling and captions
- Optional attributes: width, height, title

### Optimized Figure Tag

```markdown
{% optimizedFigure src="/path/to/image.jpg" alt="Alt text" width=800 height=600 caption="Optimized image" optimized=true /%}
```

- Uses OptimizedImage component for maximum performance
- Generates WebP/AVIF formats
- Creates responsive image sets
- Requires width and height for local images

## File Extensions

- `.mdoc` files are processed by Markdoc
- `.md` files continue to work with standard Markdown processing
- Both can coexist in the same content collection

## Configuration

The Markdoc configuration is in `markdoc.config.mjs`:

- `nodes.image` - Overrides default image rendering
- `tags.figure` - Basic figure component
- `tags.optimizedFigure` - Performance-optimized figure component

## Components

- `MarkdocImage.astro` - Handles standard image nodes
- `MarkdocFigure.astro` - Basic figure implementation
- `MarkdocOptimizedFigure.astro` - Performance-optimized figure with OptimizedImage

## Migration Guide

1. Rename `.md` files to `.mdoc`
2. Images work automatically with existing syntax
3. Add captions using `{% figure %}` tags
4. Use `{% optimizedFigure %}` for high-performance local images
5. Content collection queries remain the same

## Benefits

- **Better Performance** - Optimized images with modern formats
- **Enhanced Markup** - Semantic HTML with proper figure/figcaption
- **Component Integration** - Full access to Astro components in content
- **Backward Compatibility** - Existing Markdown syntax continues to work
- **Progressive Enhancement** - Choose optimization level per image
