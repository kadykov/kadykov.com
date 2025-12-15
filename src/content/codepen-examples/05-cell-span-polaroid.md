# Cell-Span Grid with Polaroid Frames

## Description

An enhanced cell-span grid gallery with Polaroid-style aesthetic refinements: off-white borders that act as a white-balance reference, subtle random rotations for an organic "pinned-to-wall" feel, and a neutral gray background for consistent color perception. The asymmetric borders help nudge photos toward target aspect ratios while creating a tactile, playful presentation.

**From the blog post:** [Designing a Photo Gallery that Respects Photographs](https://www.kadykov.com/blog/designing-a-photo-gallery-layout/)

## Keywords

photo-gallery, polaroid-frames, cell-span-grid, rotation, border-aesthetic

## HTML

```html
<div class="gallery">
  <div class="photo-frame landscape">
    <img src="https://picsum.photos/id/947/500/333" alt="Landscape photo 1" />
  </div>
  <div class="photo-frame portrait">
    <img src="https://picsum.photos/id/613/334/502" alt="Portrait photo 1" />
  </div>
  <div class="photo-frame landscape">
    <img src="https://picsum.photos/id/882/489/326" alt="Landscape photo 2" />
  </div>
  <div class="photo-frame portrait">
    <img src="https://picsum.photos/id/263/342/500" alt="Portrait photo 2" />
  </div>
  <div class="photo-frame landscape">
    <img src="https://picsum.photos/id/685/300/200" alt="Landscape photo 3" />
  </div>
  <div class="photo-frame square">
    <img src="https://picsum.photos/id/234/408/408" alt="Square photo 1" />
  </div>
  <div class="photo-frame landscape">
    <img src="https://picsum.photos/id/424/408/306" alt="Landscape photo 4" />
  </div>
  <div class="photo-frame portrait">
    <img src="https://picsum.photos/id/67/284/428" alt="Portrait photo 3" />
  </div>
  <div class="photo-frame square">
    <img src="https://picsum.photos/id/230/300/300" alt="Square photo 2" />
  </div>
  <div class="photo-frame portrait">
    <img src="https://picsum.photos/id/591/354/472" alt="Portrait photo 4" />
  </div>
  <div class="photo-frame portrait">
    <img src="https://picsum.photos/id/79/400/602" alt="Portrait photo 5" />
  </div>
  <div class="photo-frame landscape">
    <img src="https://picsum.photos/id/349/326/217" alt="Landscape photo 5" />
  </div>
  <div class="photo-frame portrait">
    <img src="https://picsum.photos/id/35/275/362" alt="Portrait photo 6" />
  </div>
  <div class="photo-frame landscape">
    <img src="https://picsum.photos/id/27/326/183" alt="Landscape photo 6" />
  </div>
  <div class="photo-frame landscape">
    <img src="https://picsum.photos/id/605/502/334" alt="Landscape photo 7" />
  </div>
</div>
```

## CSS

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  /* Neutral gray background for consistent color perception */
  background: oklch(0.5 0 0);
  padding: 2rem;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
}

/* Cell-span grid layout */
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(5rem, 1fr));
  gap: 1.5rem;
}

/* Polaroid-style frame container */
.photo-frame {
  /* Off-white outer border (90-95% white) */
  background: oklch(0.95 0 0);
  /* Thin light-gray inner border */
  border: 2px solid oklch(0.85 0 0);
  padding: 0.75rem;
  padding-bottom: 2rem; /* Thicker bottom border */
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-frame img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

/* Orientation-based cell spanning */
.landscape {
  grid-row: span 2;
  grid-column: span 3;
}

.square {
  grid-row: span 2;
  grid-column: span 2;
}

.portrait {
  grid-row: span 3;
  grid-column: span 2;
}

/* Subtle random rotations for organic feel */
.photo-frame:nth-child(1) {
  transform: rotate(-1.2deg);
}
.photo-frame:nth-child(2) {
  transform: rotate(0.8deg);
}
.photo-frame:nth-child(3) {
  transform: rotate(-0.5deg);
}
.photo-frame:nth-child(4) {
  transform: rotate(1.5deg);
}
.photo-frame:nth-child(5) {
  transform: rotate(-0.9deg);
}
.photo-frame:nth-child(6) {
  transform: rotate(0.6deg);
}
.photo-frame:nth-child(7) {
  transform: rotate(-1.8deg);
}
.photo-frame:nth-child(8) {
  transform: rotate(1.1deg);
}
.photo-frame:nth-child(9) {
  transform: rotate(-0.7deg);
}

/* Adjust for smaller screens */
@media (max-width: 768px) {
  .gallery {
    grid-template-columns: repeat(auto-fill, minmax(4rem, 1fr));
    gap: 1rem;
  }

  .photo-frame {
    padding: 0.5rem;
    padding-bottom: 1.5rem;
  }
}
```
