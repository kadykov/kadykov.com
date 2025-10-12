# Photo Gallery CSS Refactoring: Two-Step Classification System

## Problem Identified

The original single-step classification system had a flaw: it didn't account for how caption placement affects the final card aspect ratio.

### Original System (Single Decision)

- **Landscape** (ratio ≥ 1.2): bottom caption → 2×3 grid
- **Square** (0.85 ≤ ratio < 1.2): bottom caption → 2×2 grid
- **Portrait** (ratio < 0.85): side caption → 3×2 grid

### The Issue

For boundary aspect ratios (e.g., 0.80 or 1.30):

- Placing caption on the **bottom** makes the card MORE portrait-shaped
- Placing caption on the **side** makes the card MORE landscape-shaped

This means a photo with ratio 0.80:

- With bottom caption → becomes very portrait → should be 3×2 grid
- With side caption → becomes more square → should be 2×2 grid

The single-step system made the wrong choice for these boundary values, resulting in poor grid packing.

## Solution: Decouple Caption Placement from Grid Layout

We now have **two separate decisions** with **two separate CSS classes**:

### 1. Caption Placement Classes

Control padding to accommodate captions:

- `.caption-bottom` - adds bottom padding (1.5rem extra)
- `.caption-side` - adds left padding (1.5rem extra)

### 2. Grid Layout Classes

Control grid span independently:

- `.grid-landscape` - `grid-row: span 2; grid-column: span 3;`
- `.grid-square` - `grid-row: span 2; grid-column: span 2;`
- `.grid-portrait` - `grid-row: span 3; grid-column: span 2;`

## Two-Step Classification Logic (Refined)

```javascript
function getTwoStepClasses(width, height) {
  const ratio = width / height

  // Very landscape: caption bottom → stays landscape
  if (ratio >= 1.4) {
    return { captionClass: "caption-bottom", gridClass: "grid-landscape" }
  }

  // Almost landscape: caption SIDE → becomes MORE landscape
  if (ratio >= 1.2) {
    return { captionClass: "caption-side", gridClass: "grid-landscape" }
  }

  // Square range: caption bottom → stays square
  // Note: This also handles almost-landscape values (1.0-1.2)
  if (ratio >= 0.85) {
    return { captionClass: "caption-bottom", gridClass: "grid-square" }
  }

  // Upper almost-portrait: caption SIDE → keeps them MORE square
  // Split the almost-portrait range: values closer to square stay square
  if (ratio >= 0.8) {
    return { captionClass: "caption-side", gridClass: "grid-square" }
  }

  // Lower almost-portrait: caption BOTTOM → makes them MORE portrait
  // Values closer to portrait are pushed toward portrait
  if (ratio >= 0.7) {
    return { captionClass: "caption-bottom", gridClass: "grid-portrait" }
  }

  // Very portrait: caption side → stays portrait
  return { captionClass: "caption-side", gridClass: "grid-portrait" }
}
```

## Key Insights

### 1. Strategic Caption Placement

Caption placement pushes boundary aspect ratios toward their intended grid layout:

- **Almost-landscape photos** (1.2-1.4): Use **side caption** to make them MORE landscape
- **Upper almost-portrait** (0.80-0.85): Use **side caption** to keep them MORE square
- **Lower almost-portrait** (0.70-0.80): Use **bottom caption** to make them MORE portrait

### 2. Splitting the Almost-Portrait Range

The almost-portrait range (0.70-0.85) is split into two parts:

- **Upper part** (0.80-0.85): closer to square → side caption → square grid
- **Lower part** (0.70-0.80): closer to portrait → bottom caption → portrait grid

### 3. Square Range Handles Almost-Landscape Naturally

The square range (0.85-1.2) with bottom captions naturally handles almost-landscape values (1.0-1.2), making them more square-shaped. This is the desired behavior, so no special handling is needed.

## Classification Ranges Summary

| Range     | Caption    | Effect           | Grid            |
| --------- | ---------- | ---------------- | --------------- |
| ≥1.4      | Bottom     | Stays landscape  | Landscape (2×3) |
| 1.2–1.4   | **Side**   | → MORE landscape | Landscape (2×3) |
| 0.85–1.2  | Bottom     | Stays square     | Square (2×2)    |
| 0.80–0.85 | **Side**   | → MORE square    | Square (2×2)    |
| 0.70–0.80 | **Bottom** | → MORE portrait  | Portrait (3×2)  |
| <0.70     | Side       | Stays portrait   | Portrait (3×2)  |

## CSS Structure

**File:** `src/styles/base.css`

```css
/* Grid Layout Classes (independent) */
.grid-landscape {
  grid-row: span 2;
  grid-column: span 3;
}
.grid-square {
  grid-row: span 2;
  grid-column: span 2;
}
.grid-portrait {
  grid-row: span 3;
  grid-column: span 2;
}

/* Caption Placement Classes (independent) */
.caption-bottom > a > figure {
  padding-bottom: 2rem;
}
.caption-side > a > figure {
  padding-left: 2rem;
}

/* Caption Positioning Classes (independent) */
.caption-bottom figcaption {
  bottom: 0.5rem;
  left: 0.5rem;
  right: 0.5rem;
}
.caption-side figcaption {
  left: 0.5rem;
  top: 0.5rem;
  bottom: 0.5rem;
  writing-mode: vertical-rl;
}
```

## Testing

View `/aspect-ratio-test` to see the classification system in action with placeholder images spanning various aspect ratios from 0.4 to 2.0.

## Benefits

1. **Better grid packing** - eliminates awkward intermediate aspect ratios
2. **Smarter handling of edge cases** - split almost-portrait range
3. **More flexibility** - can mix any caption placement with any grid size
4. **Clearer intent** - two separate decisions instead of one conflated decision
5. **Testable** - can experiment with different thresholds independently
6. **Maintainable** - easier to understand and modify

## Next Steps

- ✅ CSS classes separated and refined
- ✅ Legacy classes removed
- ✅ Test page created with full classification logic
- ⏳ Update `PhotoGallery.astro` to use new two-class system
- ⏳ Verify real photo gallery looks good with actual photos
