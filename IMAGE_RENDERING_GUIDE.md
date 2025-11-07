# Image Rendering Guide

## Understanding HTML Image Dimensions

This guide explains the correct way to render responsive images in HTML and how the OptimizedImage component implements these best practices.

## Key Concepts

### 1. CSS Display Dimensions vs. Intrinsic Image Dimensions

There are two different "sizes" when working with images:

- **CSS Display Size**: The size (in CSS pixels) that the image occupies on the screen at 1x DPR
- **Intrinsic Image Size**: The actual pixel dimensions of the source image file

**Important**: The `width` and `height` attributes on `<img>` elements should represent the **CSS display dimensions**, NOT the intrinsic dimensions!

### 2. Device Pixel Ratio (DPR)

Modern displays have higher pixel density than the CSS pixel grid:

- Standard displays: 1x DPR (1 device pixel = 1 CSS pixel)
- Retina/HiDPI displays: 2x DPR (4 device pixels = 1 CSS pixel)
- High-end mobile: 3x DPR (9 device pixels = 1 CSS pixel)
- Future displays: 4x DPR

This is why we need `srcset` with multiple image resolutions.

### 3. Correct HTML Image Structure

```html
<img
  src="photo-313w.avif"
  srcset="photo-313w.avif 313w,
          photo-626w.avif 626w,
          photo-939w.avif 939w,
          photo-1252w.avif 1252w"
  sizes="(max-width: 400px) 228px,
         (max-width: 1920px) calc(19.16vw + 205.98px),
         313px"
  width="313"    <!-- CSS display width (at 1x DPR) ✅ -->
  height="235"   <!-- CSS display height (maintains aspect ratio) ✅ -->
  alt="Photo description"
  loading="lazy"
/>
```

#### What the browser does:

1. **Reserves space**: Uses width="313" and height="235" to calculate aspect ratio (4:3) and prevent layout shift (CLS)
2. **Displays at CSS size**: Shows the image at 313×235 CSS pixels
3. **Selects high-DPI image**:
   - 1x display → `photo-313w.avif`
   - 2x display (Retina) → `photo-626w.avif`
   - 3x display → `photo-939w.avif`
   - 4x display → `photo-1252w.avif`

## OptimizedImage Component API

### Clear Parameter Naming

The component uses explicit parameter names to avoid confusion:

```typescript
interface Props {
  src: string
  alt: string

  // CSS DISPLAY SIZE (what you see on screen at 1x DPR)
  displayWidth?: number

  // SOURCE IMAGE DIMENSIONS (for performance optimization)
  sourceWidth?: number
  sourceHeight?: number

  // RESPONSIVE SIZING (tells browser the rendered size at different viewports)
  sizesAttr?: string

  // ... other props
}
```

### Usage Examples

#### 1. Simple Usage (Auto-fetch dimensions)

```astro
<OptimizedImage
  src="https://example.com/photo.jpg"
  alt="A beautiful sunset"
  displayWidth={660}
/>
```

**What happens**:

- Fetches remote image to determine aspect ratio
- Generates srcset: `660w, 720w, 900w, 1080w, 1280w, 1600w, 1920w, 2400w, 2640w` (up to 4x DPR)
- Returns `width={660}` and `height` (calculated from aspect ratio) for HTML attributes

#### 2. Performance-Optimized (Avoid remote fetch)

```astro
<OptimizedImage
  src="https://example.com/photo.jpg"
  alt="A beautiful sunset"
  displayWidth={660}
  sourceWidth={3000}
  sourceHeight={2000}
/>
```

**What happens**:

- Skips remote fetch (uses provided dimensions for aspect ratio)
- Same srcset generation
- Faster build times!

#### 3. Responsive with Custom Sizes

```astro
<OptimizedImage
  src="https://example.com/photo.jpg"
  alt="A beautiful sunset"
  displayWidth={660}
  sizesAttr="(max-width: 768px) 100vw, 660px"
  sourceWidth={3000}
  sourceHeight={2000}
/>
```

**What happens**:

- Mobile: Image uses full viewport width
- Desktop: Image displays at 660px
- Browser selects appropriate srcset width based on viewport and DPR

#### 4. Photo Gallery (Calculated dimensions)

```astro
---
import { classifyPhoto, getImageDimensions } from "../utils/photoClassification"

const classification = classifyPhoto(photo.width, photo.height)
const { displayWidth, sizesAttr } = getImageDimensions(classification)
---

<OptimizedImage
  src={photoUrl}
  alt="Gallery photo"
  displayWidth={displayWidth}
  sizesAttr={sizesAttr}
  sourceWidth={photo.width}
  sourceHeight={photo.height}
/>
```

**What happens**:

- `displayWidth` is calculated based on grid layout (e.g., 313px for landscape thumbnails)
- `sizesAttr` provides responsive sizing formula
- Generates appropriate srcset (313w to 1252w for 4x DPR)

## How imageOptimization.ts Works

### Smart Width Filtering

The utility automatically filters srcset widths based on display size and DPR:

```typescript
// Standard widths available
const STANDARD_WIDTHS = [
  200, 240, 288, 350, 420, 500, 600, 720, 900, 1080, 1280, 1600, 1920, 2400,
  2880, 3500, 4096, 5120, 6144,
]

// For displayWidth = 313px
filterWidthsForDisplay(313, STANDARD_WIDTHS)
// Returns: [350, 420, 500, 600, 720, 900, 1080, 1252]
// Range: 313px (1x) to 1252px (4x DPR)
```

### Important Optimization

The utility **never generates images larger than the source**:

```typescript
// If source image is 1200px wide and we request 2000px
// The utility caps at 1200px to avoid:
// 1. Upscaling artifacts
// 2. Duplicate cache entries for same full-resolution image
```

## Benefits of This Approach

### 1. Prevents Layout Shift (CLS)

The browser knows the aspect ratio before the image loads, reserving the correct space.

### 2. Perfect for Responsive Designs

Works seamlessly with CSS like `img { width: 100%; height: auto; }`

### 3. Supports High-DPI Displays

Automatically serves sharp images for Retina and high-density screens.

### 4. Optimal Performance

- Generates only needed image sizes (1x to 4x DPR)
- Shares cache across components
- Skips unnecessary remote fetches when dimensions provided

### 5. Clear API

Parameter names make it obvious what each dimension represents.

## Common Misconceptions

### ❌ Wrong: "width/height must match original image dimensions"

```html
<!-- WRONG: Using original dimensions (3000×2000) -->
<img
  src="photo-313w.avif"
  width="3000"
  height="2000"
  style="max-width: 313px; height: auto;"
/>
```

**Problems**:

- Browser reserves 3000×2000px space (huge layout shift!)
- Incorrect aspect ratio calculation
- Poor accessibility

### ✅ Correct: "width/height match CSS display size"

```html
<!-- CORRECT: Using CSS display dimensions (313×235) -->
<img
  src="photo-313w.avif"
  srcset="photo-313w.avif 313w, photo-626w.avif 626w, ..."
  width="313"
  height="235"
/>
```

**Benefits**:

- Reserves correct 313×235px space
- Correct aspect ratio (4:3)
- Browser selects high-DPI images from srcset
- No layout shift

## References

- [MDN: Responsive images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [web.dev: Optimize CLS](https://web.dev/optimize-cls/)
- [HTML Standard: Image dimensions](https://html.spec.whatwg.org/multipage/embedded-content.html#dimension-attributes)

## Summary

1. **CSS display dimensions** → `width` and `height` HTML attributes
2. **Source image dimensions** → `sourceWidth` and `sourceHeight` props (performance only)
3. **srcset** → Generated automatically for 1x to 4x DPR
4. **sizes** → Tells browser the rendered size at different viewports

This approach ensures optimal performance, prevents layout shift, and provides sharp images on all displays!
